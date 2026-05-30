import React, { useState, useRef, useEffect } from "react";
import HeadersEditor from "./HeadersEditor";
import AuthPanel from "./AuthPanel";

const methodLabelStyles = {
  GET: "m-GET",
  POST: "m-POST",
  PUT: "m-PUT",
  DELETE: "m-DELETE",
};

const methodOptions = [
  { value: "GET", label: "Retrieve resource", variant: "pill-get", section: "Read" },
  { value: "POST", label: "Create resource", variant: "pill-post", section: "Write" },
  { value: "PUT", label: "Replace resource", variant: "pill-put", section: "Write" },
  { value: "DELETE", label: "Remove resource", variant: "pill-delete", section: "Destructive" },
];

const methodSections = ["Read", "Write", "Destructive"];

export default function RequestPanel({
  method,
  url,
  body,
  authType,
  headers,
  loading,
  onSubmit,
  setMethod,
  setUrl,
  setBody,
  handleHeaderChange,
  addHeader,
  removeHeader,
  setAuthType,
  username,
  setUsername,
  password,
  setPassword,
  token,
  setToken,
}) {
  const [methodOpen, setMethodOpen] = useState(false);
  const methodMenuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (methodMenuRef.current && !methodMenuRef.current.contains(event.target)) {
        setMethodOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-6  border border-pm-border bg-pm-panel p-5 shadow-panel card">
      <div className="flex w-full items-center gap-4">
        <div style={{ width: 180 }} className="inner-card">
          <div className="inner-label">
            <span>Method</span>
            <span className={`badge ${methodLabelStyles[method]}`}>{method}</span>
          </div>

          <div ref={methodMenuRef} className="dd-wrap">
            <button
              type="button"
              className={`dd-trigger method-${method.toLowerCase()} ${methodOpen ? "open" : ""}`}
              onClick={() => setMethodOpen((open) => !open)}
            >
              <span>{method}</span>
              <span className="chevron">▼</span>
            </button>

            <div className={`dd-menu ${methodOpen ? "show" : ""}`}>
              {methodSections.map((section, sectionIndex) => (
                <React.Fragment key={section}>
                  <div className="dd-section-label">{section}</div>
                  {methodOptions
                    .filter((option) => option.section === section)
                    .map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`dd-item ${method === option.value ? "active" : ""} ${option.value === "DELETE" ? "danger" : ""}`}
                        onClick={() => {
                          setMethod(option.value);
                          setMethodOpen(false);
                        }}
                      >
                        <span className={`method-pill ${option.variant}`}>{option.value}</span>
                        <span className="item-label">{option.label}</span>
                      </button>
                    ))}
                  {sectionIndex < methodSections.length - 1 && <div className="dd-divider" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="inner-card flex-1">
          <div className="inner-label"><span>Request URL</span></div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/playlists"
            required
            className="input-field"
          />
        </div>

        <div style={{ width: 170 }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-send w-full"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>

      {/* <div className="mt-4">
        <div className="preview-box">
          <strong>Request preview</strong>
          This panel keeps your request configuration separate from the response. It is easy to extend with more auth modes and reusable headers.
        </div>
      </div> */}

      <HeadersEditor
        headers={headers}
        onHeaderChange={handleHeaderChange}
        onAddHeader={addHeader}
        onRemoveHeader={removeHeader}
      />

      {(method === "POST" || method === "PUT") && (
        <section className="space-y-3 rounded-[28px] border border-pm-border bg-pm-bg/75 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-pm-text">Request Body</h3>
              <p className="text-sm text-pm-muted">Provide a JSON payload for POST and PUT requests.</p>
            </div>
            <span className="rounded-full border border-pm-border bg-pm-panel/80 px-3 py-1 text-xs font-semibold text-pm-muted">
              JSON payload
            </span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"name": "Chill Vibes", "tracks": 12}'
            className="min-h-[180px] w-full rounded-[28px] border border-pm-border bg-white px-4 py-4 text-sm text-pm-text outline-none transition focus:border-pm-orange focus:ring-2 focus:ring-pm-orange/20"
          />
        </section>
      )}

      <AuthPanel
        authType={authType}
        setAuthType={setAuthType}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        token={token}
        setToken={setToken}
      />
    </form>
  );
}
