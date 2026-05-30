import React from "react";

export default function HeadersEditor({ headers, onHeaderChange, onAddHeader, onRemoveHeader }) {
    return (
        <section className="space-y-4  border border-pm-border bg-[--pm-panel] p-5 shadow-panel card">
            <div className="section-head ">
                <div>
                    <h2>Headers</h2>
                    <p>Add request headers to customize the API call.</p>
                </div>
                <button type="button" onClick={onAddHeader} className="btn-sec">+ Add Header</button>
            </div>

            <div className="header-rows">
                {headers.map((header, index) => (
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
                        <button type="button" onClick={() => onRemoveHeader(index)} className="btn-remove">×</button>
                    </div>
                ))}
            </div>
        </section>
    );
}
