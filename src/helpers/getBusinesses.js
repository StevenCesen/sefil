export default async function getBusinesses() {
    const endpoint = `${import.meta.env.VITE_URL_BASE}/businesses`;

    const request = await fetch(endpoint, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (request.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
        return;
    }

    const response = await request.json();
    return response;
}
