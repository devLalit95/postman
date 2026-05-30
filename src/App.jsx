import React, { useState } from "react";
import RequestPanel from "./components/RequestPanel";
import ResponsePanel from "./components/ResponsePanel";
import "./index.css";

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("http://localhost:8080/");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("{\n  \n}");
  const [authType, setAuthType] = useState("none");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("raw");

  const handleHeaderChange = (index, field, value) => {
    setHeaders((current) =>
      current.map((header, idx) =>
        idx === index ? { ...header, [field]: value } : header,
      ),
    );
  };

  const addHeader = () => {
    setHeaders((current) => [...current, { key: "", value: "" }]);
  };

  const removeHeader = (index) => {
    setHeaders((current) => current.filter((_, idx) => idx !== index));
  };

  const handleUseBearerToken = (nextToken) => {
    setAuthType("bearer");
    setToken(nextToken);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestHeaders = headers.reduce((acc, header) => {
        if (header.key.trim()) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {});

      if (authType === "basic" && username && password) {
        requestHeaders.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
      } else if (authType === "bearer" && token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      if ((method === "POST" || method === "PUT") && !requestHeaders["Content-Type"]) {
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

      const contentType = res.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : await res.text();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
        time: (endTime - startTime).toFixed(2),
      });
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="workspace">
        <header className="app-header">
          <div className="header-left">
            <p className="eyebrow">API Sandbox</p>
            <h1>Postman-style API Tester</h1>
          </div>
          <div className="header-right" aria-label="Application status">
            <span className="status-dot" aria-hidden="true" />
            <span>Ready</span>
          </div>
        </header>

        <RequestPanel
          method={method}
          url={url}
          body={body}
          authType={authType}
          headers={headers}
          loading={loading}
          onSubmit={handleSubmit}
          setMethod={setMethod}
          setUrl={setUrl}
          setBody={setBody}
          handleHeaderChange={handleHeaderChange}
          addHeader={addHeader}
          removeHeader={removeHeader}
          setAuthType={setAuthType}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          token={token}
          setToken={setToken}
        />

        <ResponsePanel
          response={response}
          viewMode={viewMode}
          setViewMode={setViewMode}
          loading={loading}
          onUseBearerToken={handleUseBearerToken}
        />
      </div>
    </main>
  );
}

export default App;
