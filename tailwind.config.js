export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "pm-orange": "#FF6C37",
                "pm-orange-dark": "#E85A25",
                "pm-orange-light": "#FFF0EB",
                "pm-sidebar": "#1E1E2E",
                "pm-sidebar-hover": "#2A2A3E",
                "pm-sidebar-active": "#FF6C3722",
                "pm-bg": "#F8F7F5",
                "pm-panel": "#FFFFFF",
                "pm-border": "#E5E3DF",
                "pm-text": "#1A1A2E",
                "pm-muted": "#6B6B80",
                "pm-get": "#49CC90",
                "pm-post": "#FF6C37",
                "pm-put": "#FCA130",
                "pm-del": "#F93E3E",
            },
            boxShadow: {
                panel: "0 28px 90px rgba(30, 30, 46, 0.08)",
            },
        },
    },
    plugins: [],
};
