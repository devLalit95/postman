import React from "react";

export default function HeadersEditor({ headers, onHeaderChange, onAddHeader, onRemoveHeader }) {
    return (
        <section className="config-section">
            <div className="section-head">
                <div>
                    <h2>Headers</h2>
                    <p>{headers.length} row{headers.length === 1 ? "" : "s"}</p>
                </div>
                <button type="button" onClick={onAddHeader} className="btn-sec">
                    <span aria-hidden="true">+</span>
                    <span>Add Header</span>
                </button>
            </div>

            <div className="header-rows">
                {headers.length === 0 ? (
                    <div className="empty-inline">No headers</div>
                ) : (
                    headers.map((header, index) => (
                        <div key={index} className="header-row">
                            <input
                                type="text"
                                value={header.key}
                                onChange={(e) => onHeaderChange(index, "key", e.target.value)}
                                placeholder="Header key"
                                className="input-field"
                            />
                            <input
                                type="text"
                                value={header.value}
                                onChange={(e) => onHeaderChange(index, "value", e.target.value)}
                                placeholder="Header value"
                                className="input-field"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveHeader(index)}
                                className="btn-remove"
                                aria-label="Remove header"
                                title="Remove header"
                            >
                                x
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
