import React, { useState } from "react";
import RequestPanel from "./components/RequestPanel";
import ResponsePanel from "./components/ResponsePanel";
import "./index.css";

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

      const responseData = await res.json().catch(() => null);

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
    <main className="min-h-screen bg-pm-bg px-4 py-8 text-pm-text sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 test">
        <header className=" border border-pm-border  test p-6 shadow-panel card">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="header-left space-y-3 ">
              <p className="eyebrow">API Sandbox</p>
              <h1 className="text-3xl font-semibold text-pm-text">Postman-style API Tester</h1>
              <p className="max-w-2xl text-sm leading-7 text-pm-muted">
                Build requests, inspect results, and reuse components across your API playground.
              </p>
            </div>
            <div className="header-right">Central theme: orange + neutral palette</div>
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

        <ResponsePanel response={response} viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </main>
  );
}

export default App;
