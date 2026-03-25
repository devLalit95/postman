import React, { useState } from "react";
import "./App.css";

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("http://localhost:8080/");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [authType, setAuthType] = useState("none");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("raw"); // 'raw' or 'table'

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const requestHeaders = headers.reduce((acc, header) => {
        if (header.key.trim()) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {});

      // Add authorization header if selected
      if (authType === "basic" && username && password) {
        const basicAuth = btoa(`${username}:${password}`);
        requestHeaders["Authorization"] = `Basic ${basicAuth}`;
      } else if (authType === "bearer" && token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }

      // Set Content-Type for POST/PUT if not already set
      if (
        (method === "POST" || method === "PUT") &&
        !requestHeaders["Content-Type"]
      ) {
        requestHeaders["Content-Type"] = "application/json";
      }

      const options = {
        method,
        headers: requestHeaders,
      };

      if (method === "POST" || method === "PUT") {
        options.body = body;
      }

      const startTime = performance.now();
      const res = await fetch(url, options);
      const endTime = performance.now();

      const responseData = await res.json().catch(() => null);

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
        time: (endTime - startTime).toFixed(2),
      });
    } catch (error) {
      setResponse({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderJsonAsTable = (data) => {
    if (!data || typeof data !== "object") {
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }

    if (Array.isArray(data)) {
      return (
        <table className="json-table">
          <thead>
            <tr>
              {Object.keys(data[0] || {}).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, i) => (
                  <td key={i}>
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <table className="json-table">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <th>{key}</th>
              <td>
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>API Tester</h1>
        <div className="app-description">A simple Postman-like application</div>
        <div className="app-description">Developed by - Lalit</div>
      </header>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="request-section">
          <div className="method-url">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="method-select"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              required
              className="url-input"
            />
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <span className="spinner"></span> Sending...
                </>
              ) : (
                "Send"
              )}
            </button>
          </div>

          <div className="headers-section">
            <div className="section-header">
              <h3>Headers</h3>
              <button type="button" onClick={addHeader} className="add-button">
                + Add Header
              </button>
            </div>
            {headers.map((header, index) => (
              <div key={index} className="header-row">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, "key", e.target.value)
                  }
                  placeholder="Key"
                  className="header-input"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) =>
                    handleHeaderChange(index, "value", e.target.value)
                  }
                  placeholder="Value"
                  className="header-input"
                />
                <button
                  type="button"
                  onClick={() => removeHeader(index)}
                  className="remove-button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {(method === "POST" || method === "PUT") && (
            <div className="body-section">
              <h3>Request Body</h3>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='Enter JSON body (e.g., {"key": "value"})'
                className="body-textarea"
              />
            </div>
          )}

          <div className="auth-section">
            <h3>Authorization</h3>
            <div className="auth-controls">
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
                className="auth-select"
              >
                <option value="none">No Auth</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
              </select>

              {authType === "basic" && (
                <div className="basic-auth-fields">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="auth-input"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="auth-input"
                  />
                </div>
              )}

              {authType === "bearer" && (
                <div className="bearer-auth-field">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Bearer Token"
                    className="auth-input"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {response && (
        <div className="response-section">
          <div className="response-header">
            <h2>Response</h2>
            <div className="view-toggle">
              <button
                onClick={() => setViewMode("raw")}
                className={viewMode === "raw" ? "active" : ""}
              >
                Raw
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "active" : ""}
              >
                Table
              </button>
            </div>
          </div>

          {response.error ? (
            <div className="error-message">
              <div className="error-icon">!</div>
              <div>{response.error}</div>
            </div>
          ) : (
            <>
              <div className="status-info">
                <span
                  className={`status-code ${
                    response.status >= 400 ? "error" : "success"
                  }`}
                >
                  {response.status}
                </span>
                <span className="status-text">{response.statusText}</span>
                <span className="response-time">{response.time} ms</span>
              </div>

              <div className="response-headers">
                <h3>Headers</h3>
                <div className="headers-container">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="header-item">
                      <span className="header-key">{key}:</span>
                      <span className="header-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="response-body">
                <h3>Body</h3>
                {viewMode === "raw" ? (
                  <pre className="json-pretty">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                ) : (
                  renderJsonAsTable(response.data)
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
