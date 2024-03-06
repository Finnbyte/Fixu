function ensureAuth() {
    return fetch("/api/session", {
        credentials: "include",
    });
}

function login(email: string, password: string) {
    return fetch("/api/session", {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" }
    });
}

export const authService = { ensureAuth, login }