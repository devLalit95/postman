import React, { useState } from "react";

function formatValue(value) {
    if (value === null) return "null";
    if (value === undefined) return "";
    return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function formatRawBody(data) {
    return typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

function looksLikeUrl(value) {
    return /^https?:\/\/\S+$/i.test(value.trim());
}

function renderTableValue(value) {
    const formattedValue = formatValue(value);
    const isUrl = typeof value === "string" && looksLikeUrl(value);
    const className = `table-value ${isUrl ? "is-url" : ""}`;

    if (isUrl) {
        return (
            <a className={className} href={value} target="_blank" rel="noreferrer" title={value}>
                {formattedValue}
            </a>
        );
    }

    return <span className={className} title={formattedValue}>{formattedValue}</span>;
}

function isBearerKey(key) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    return normalized.includes("bearer");
}

function extractBearerToken(value, key = "") {
    const text = value.trim();
    const explicitBearer = text.match(/\bbearer\s+([^\s'",;]+)/i);

    if (explicitBearer?.[1]) {
        return explicitBearer[1].trim();
    }

    if (key && isBearerKey(key)) {
        return text;
    }

    return null;
}

function hasBearerSignal(key, value) {
    return isBearerKey(key) || (typeof value === "string" && /\bbearer\s+/i.test(value));
}

function findBearerTokenCandidate(data, path = "data", key = "") {
    if (typeof data === "string") {
        const token = extractBearerToken(data, key);
        return token ? { label: key || "bearer", path, value: token } : null;
    }

    if (!data || typeof data !== "object") {
        return null;
    }

    if (Array.isArray(data)) {
        for (let index = 0; index < data.length; index += 1) {
            const match = findBearerTokenCandidate(data[index], `${path}[${index}]`);
            if (match) return match;
        }
        return null;
    }

    const entries = Object.entries(data).sort(([leftKey, leftValue], [rightKey, rightValue]) => {
        return Number(hasBearerSignal(rightKey, rightValue)) - Number(hasBearerSignal(leftKey, leftValue));
    });

    for (const [key, value] of entries) {
        const nextPath = `${path}.${key}`;
        if (typeof value === "string") {
            const token = extractBearerToken(value, key);
            if (token) {
                return { label: key, path: nextPath, value: token };
            }
        }

        const match = findBearerTokenCandidate(value, nextPath, key);
        if (match) return match;
    }

    return null;
}

function renderJsonAsTable(data) {
    if (!data || typeof data !== "object") {
        return <pre className="code-block">{formatRawBody(data)}</pre>;
    }

    if (Array.isArray(data)) {
        if (data.length === 0) {
            return <div className="empty-box">[]</div>;
        }

        const objectRows = data.every((item) => item && typeof item === "object" && !Array.isArray(item));

        if (!objectRows) {
            return (
                <div className="table-wrap">
                    <table className="data-table">
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <th>{index}</th>
                                    <td data-label="Value">{renderTableValue(item)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        const keys = Array.from(new Set(data.flatMap((item) => Object.keys(item))));

        return (
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            {keys.map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {keys.map((key) => (
                                    <td key={key} data-label={key}>{renderTableValue(item[key])}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="table-wrap">
            <table className="data-table">
                <tbody>
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key}>
                            <th>{key}</th>
                            <td data-label="Value">{renderTableValue(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ResponsePanel({ response, viewMode, setViewMode, loading, onUseBearerToken }) {
    const [copied, setCopied] = useState(false);
    const [headersOpen, setHeadersOpen] = useState(false);
    const hasResponse = Boolean(response);
    const isError = Boolean(response?.error || response?.status >= 400);
    const showInitialLoading = loading && !hasResponse;
    const showUpdating = loading && hasResponse;
    const tokenCandidate = hasResponse && !response?.error ? findBearerTokenCandidate(response.data) : null;
    const responseHeaders = response?.headers ?? {};
    const responseHeaderCount = Object.keys(responseHeaders).length;

    const handleCopyToken = async () => {
        if (!tokenCandidate) return;

        try {
            await navigator.clipboard.writeText(tokenCandidate.value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    };

    const handleUseBearerToken = () => {
        if (!tokenCandidate) return;
        onUseBearerToken?.(tokenCandidate.value);
    };

    return (
        <section className={`response-panel panel ${loading ? "is-loading" : ""}`}>
            <div className="section-head">
                <div>
                    <h2>Response</h2>
                    <p>{loading ? "Sending request..." : hasResponse ? "Latest result" : "No response yet"}</p>
                </div>
                <div className="res-tabs" role="tablist" aria-label="Response view">
                    {["raw", "table"].map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            role="tab"
                            aria-selected={viewMode === mode}
                            onClick={() => setViewMode(mode)}
                            className={`res-tab ${viewMode === mode ? "active" : ""}`}
                        >
                            {mode === "raw" ? "Body" : "Table"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="response-stage" aria-busy={loading}>
                {showUpdating && (
                    <div className="response-busy" aria-live="polite">
                        <span className="spinner" aria-hidden="true" />
                        <span>Updating response</span>
                    </div>
                )}

                {showInitialLoading ? (
                    <div className="response-loading" aria-live="polite">
                        <div className="skeleton-meta">
                            <span />
                            <span />
                            <span />
                        </div>
                        <div className="skeleton-body">
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                ) : !hasResponse ? (
                    <div className="response-empty">
                        <span className="response-empty-dot" aria-hidden="true" />
                        <span>Waiting for a request</span>
                    </div>
                ) : response.error ? (
                    <div className="error-box">
                        <p>Request failed</p>
                        <span>{response.error}</span>
                    </div>
                ) : (
                    <div className={`response-result ${showUpdating ? "is-updating" : ""}`}>
                        <div className="response-meta">
                            <div className="metric">
                                <span className="metric-label">Status</span>
                                <strong className={`metric-value ${isError ? "is-error" : "is-ok"}`}>
                                    {response.status}
                                </strong>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Text</span>
                                <strong className="metric-value">{response.statusText || "OK"}</strong>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Time</span>
                                <strong className="metric-value">{response.time} ms</strong>
                            </div>
                        </div>

                        <div className="headers-drawer">
                            <button
                                type="button"
                                className="header-toggle"
                                aria-expanded={headersOpen}
                                onClick={() => setHeadersOpen((open) => !open)}
                            >
                                <span>View Headers</span>
                                <strong>{responseHeaderCount}</strong>
                                <span className="header-toggle-icon" aria-hidden="true">v</span>
                            </button>
                            <div className={`headers-dropdown ${headersOpen ? "is-open" : ""}`}>
                                <div className="headers-dropdown-inner">
                                    <div className="headers-list">
                                        {Object.entries(responseHeaders).map(([key, value]) => (
                                            <div key={key} className="header-item">
                                                <span>{key}</span>
                                                <strong>{value}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="response-content">
                            <section className="response-block">
                                <div className="block-title">
                                    <h3>Body</h3>
                                    <span>{viewMode === "raw" ? "Raw" : "Table"}</span>
                                </div>
                                {tokenCandidate && (
                                    <div className="token-tools">
                                        <div className="token-copy">
                                            <span>{tokenCandidate.path}</span>
                                            <strong>{tokenCandidate.value}</strong>
                                        </div>
                                        <div className="token-actions">
                                            <button type="button" className="token-action" onClick={handleCopyToken}>
                                                {copied ? "Copied" : "Copy Token"}
                                            </button>
                                            <button type="button" className="token-action primary" onClick={handleUseBearerToken}>
                                                Use as Bearer
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {viewMode === "raw" ? (
                                    <pre className="code-block">{formatRawBody(response.data)}</pre>
                                ) : (
                                    renderJsonAsTable(response.data)
                                )}
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
