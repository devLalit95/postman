import React, { useState, useRef, useEffect } from "react";

const authOptions = [
    {
        value: "none",
        label: "No auth",
        sub: "Public endpoint",
        iconText: "No",
        iconClass: "auth-none",
    },
    {
        value: "bearer",
        label: "Bearer token",
        sub: "Authorization: Bearer ...",
        iconText: "BT",
        iconClass: "auth-bearer",
    },
    {
        value: "basic",
        label: "Basic auth",
        sub: "Username + password",
        iconText: "BA",
        iconClass: "auth-basic",
    },
];

export default function AuthPanel({
    authType,
    setAuthType,
    username,
    setUsername,
    password,
    setPassword,
    token,
    setToken,
}) {
    const [authOpen, setAuthOpen] = useState(false);
    const authMenuRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
                setAuthOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const selectedAuth = authOptions.find((option) => option.value === authType);

    return (
        <section className="config-section">
            <div className="section-head">
                <div>
                    <h2>Authorization</h2>
                    <p>{selectedAuth?.label ?? "No auth"}</p>
                </div>

                <div ref={authMenuRef} className="dd-wrap">
                    <button
                        type="button"
                        className={`dd-trigger ${authOpen ? "open" : ""}`}
                        aria-haspopup="listbox"
                        aria-expanded={authOpen}
                        onClick={() => setAuthOpen((open) => !open)}
                    >
                        <span className={`auth-icon ${selectedAuth?.iconClass ?? "auth-none"}`}>
                            {selectedAuth?.iconText ?? "No"}
                        </span>
                        <span>{selectedAuth?.label ?? "No auth"}</span>
                        <span className="chevron" aria-hidden="true">v</span>
                    </button>

                    <div className={`dd-menu ${authOpen ? "show" : ""}`} role="listbox">
                        {authOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`dd-item ${authType === option.value ? "active" : ""}`}
                                role="option"
                                aria-selected={authType === option.value}
                                onClick={() => {
                                    setAuthType(option.value);
                                    setAuthOpen(false);
                                }}
                            >
                                <div className={`auth-icon ${option.iconClass}`}>{option.iconText}</div>
                                <div>
                                    <div className="item-label">{option.label}</div>
                                    <div className="item-sub">{option.sub}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {authType === "basic" && (
                <div className="auth-fields">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="input-field"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="input-field"
                    />
                </div>
            )}

            {authType === "bearer" && (
                <div className="auth-fields single">
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Bearer token"
                        className="input-field"
                    />
                </div>
            )}
        </section>
    );
}
