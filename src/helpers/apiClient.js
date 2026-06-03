const BASE = import.meta.env.VITE_URL_BASE;

function authHeaders(extra = {}) {
    return {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        ...extra
    };
}

function handle401() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
}

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: { ...authHeaders(), ...options.headers }
    });
    if (res.status === 401) { handle401(); return null; }
    return res;
}

export async function apiGet(path) {
    const res = await request(path);
    if (!res) return null;
    return res.json();
}

export async function apiPost(path, body, useForm = false) {
    const hasBody = body !== undefined && body !== null;
    const headers = (hasBody && !useForm) ? { 'Content-Type': 'application/json' } : {};
    const serialized = !hasBody ? undefined : useForm ? new URLSearchParams(body) : JSON.stringify(body);
    const res = await request(path, { method: 'POST', headers, body: serialized });
    if (!res) return null;
    return res.json();
}

export async function apiPut(path, body) {
    const res = await request(path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res) return null;
    return res.json();
}

export async function apiPatch(path, body) {
    const res = await request(path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res) return null;
    return res.json();
}

export async function apiDelete(path) {
    const res = await request(path, { method: 'DELETE' });
    if (!res) return null;
    return res.json();
}

export async function apiBlob(path) {
    const res = await request(path);
    if (!res) return null;
    if (!res.ok) throw new Error('Error al descargar el archivo');
    return res.blob();
}
