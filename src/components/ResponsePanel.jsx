import React from "react";

function renderJsonAsTable(data) {
    if (!data || typeof data !== "object") {
        return <pre className="whitespace-pre-wrap rounded-3xl border border-pm-border bg-pm-bg/80 p-4 text-sm text-pm-text">{JSON.stringify(data, null, 2)}</pre>;
    }

    if (Array.isArray(data)) {
        return (
            <div className=" overflow-x-auto rounded-3xl border border-pm-border bg-pm-bg/80 p-4">
                <table className="min-w-full divide-y divide-pm-border text-left text-sm text-pm-text">
                    <thead className="bg-pm-bg/90 text-xs uppercase tracking-[0.18em] text-pm-muted">
                        <tr>
                            {Object.keys(data[0] || {}).map((key) => (
                                <th key={key} className="px-3 py-3 font-semibold">
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pm-border">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-pm-panel/80">
                                {Object.values(item).map((value, i) => (
                                    <td key={i} className="px-3 py-3 align-top">
                                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-3xl border border-pm-border bg-pm-bg/80 p-4">
            <table className="min-w-full divide-y divide-pm-border text-left text-sm text-pm-text">
                <tbody className="divide-y divide-pm-border">
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key} className="hover:bg-pm-panel/80">
                            <th className="px-3 py-3 font-semibold text-pm-text">{key}</th>
                            <td className="px-3 py-3 align-top text-pm-muted">
                                {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ResponsePanel({ response, viewMode, setViewMode }) {
    if (!response) {
        return null;
    }

    const statusClass = response.status >= 400 ? "bg-pm-del/10 text-pm-del" : "bg-pm-get/10 text-pm-get";

    return (
        <section className="space-y-6 card border border-pm-border bg-pm-panel p-5 shadow-panel">
            <div className="section-head">
                <div>
                    <h2>Response</h2>
                    <p>Review the API result and headers below.</p>
                </div>
                <div className="res-tabs">
                    {['raw', 'table'].map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setViewMode(mode)}
                            className={`res-tab ${viewMode === mode ? 'active' : ''}`}
                        >
                            {mode === 'raw' ? 'Body' : 'Table'}
                        </button>
                    ))}
                </div>
            </div>

            {response.error ? (
                <div className="rounded-[28px] border border-pm-del/40 bg-pm-del/10 p-5 text-sm text-pm-text shadow-sm">
                    <p className="font-semibold text-pm-del">Request failed</p>
                    <p className="mt-2 text-pm-muted">{response.error}</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className={`rounded-[28px] border border-pm-border bg-pm-bg/80 p-4 text-sm font-semibold ${statusClass}`}>
                            {response.status}
                        </div>
                        <div className="rounded-[28px] border border-pm-border bg-pm-bg/80 p-4 text-sm text-pm-muted">
                            {response.statusText}
                        </div>
                        <div className="rounded-[28px] border border-pm-border bg-pm-bg/80 p-4 text-sm text-pm-muted">
                            {response.time} ms
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[28px] border border-pm-border bg-pm-bg/80 p-5 shadow-sm">
                            <h3 className="mb-3 text-base font-semibold text-pm-text">Headers</h3>
                            <div className="grid gap-2 text-sm text-pm-muted">
                                {Object.entries(response.headers).map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-1 rounded-3xl bg-white/80 p-3">
                                        <span className="text-xs uppercase tracking-[0.18em] text-pm-muted">{key}</span>
                                        <span className="text-sm text-pm-text">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-pm-text">Body</h3>
                                <span className="text-sm text-pm-muted">{viewMode === 'raw' ? 'Raw JSON' : 'Table view'}</span>
                            </div>
                            {viewMode === "raw" ? (
                                <pre className="whitespace-pre-wrap rounded-[28px] border border-pm-border bg-pm-bg/80 p-5 text-sm text-pm-text">{JSON.stringify(response.data, null, 2)}</pre>
                            ) : (
                                renderJsonAsTable(response.data)
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
