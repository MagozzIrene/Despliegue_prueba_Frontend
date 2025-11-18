const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

let timer = null;

function buildHeaders(getToken) {
    const token = getToken?.();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function post(url, getToken) {
    try {
        await fetch(url, { method: "POST", headers: buildHeaders(getToken) });
    } catch {
    }
}

export function startPresenceHeartbeat(getToken, periodMs = 45_000) {
    if (timer) return;
    const ping = () => post(`${API_BASE}/api/presence/ping`, getToken);

    ping();
    timer = setInterval(ping, periodMs);
}

export async function stopPresenceHeartbeat(getToken) {
    if (timer) { clearInterval(timer); timer = null; }
    await post(`${API_BASE}/api/presence/logout`, getToken);
}
