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

  const handleMethodSelect = (nextMethod) => {
    setMethod(nextMethod);
    if ((nextMethod === "POST" || nextMethod === "PUT") && !body.trim()) {
      setBody("{\n  \n}");
    }
    setMethodOpen(false);
  };

  return (
    <form onSubmit={onSubmit} className="request-form panel">
      <div className="request-line">
        <div className="field-group method-field">
          <div className="field-meta">
            <span className="field-label">Method</span>
            <span className={`badge ${methodLabelStyles[method]}`}>{method}</span>
          </div>

          <div ref={methodMenuRef} className="dd-wrap">
            <button
              type="button"
              className={`dd-trigger method-${method.toLowerCase()} ${methodOpen ? "open" : ""}`}
              aria-haspopup="listbox"
              aria-expanded={methodOpen}
              onClick={() => setMethodOpen((open) => !open)}
            >
              <span>{method}</span>
              <span className="chevron" aria-hidden="true">v</span>
            </button>

            <div className={`dd-menu ${methodOpen ? "show" : ""}`} role="listbox">
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
                        role="option"
                        aria-selected={method === option.value}
                        onClick={() => handleMethodSelect(option.value)}
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

        <div className="field-group url-field">
          <label htmlFor="request-url" className="field-label">Request URL</label>
          <input
            id="request-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/playlists"
            required
            className="input-field request-url-input"
          />
        </div>

        <div className="send-slot">
          <button type="submit" disabled={loading} className="btn-send">
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      <HeadersEditor
        headers={headers}
        onHeaderChange={handleHeaderChange}
        onAddHeader={addHeader}
        onRemoveHeader={removeHeader}
      />

      {(method === "POST" || method === "PUT") && (
        <section className="config-section request-body">
          <div className="body-header">
            <div>
              <h2>Request Body</h2>
              <p>JSON payload</p>
            </div>
            <span className="soft-pill">JSON</span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{\n  "email": "user@example.com",\n  "password": "password"\n}'
            className="input-field body-textarea"
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
