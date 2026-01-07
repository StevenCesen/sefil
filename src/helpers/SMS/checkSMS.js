export default async function checkSMS({ client_ci, id_credit, id_campain }) {
    const endpoint = `${import.meta.env.VITE_URL_BASE}/check-sms`;

    const url = `${endpoint}?client_ci=${client_ci}&id_credit=${id_credit}&id_campain=${id_campain}`;

    const request = await fetch(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (request.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }

    const response = await request.json();
    return response;
}
