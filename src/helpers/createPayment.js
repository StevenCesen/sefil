export default async function createPayment({ data }) {
    try {
        const request = await fetch(`${import.meta.env.VITE_URL_BASE}/payments`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (request.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        const response = await request.json();

        return response;

    } catch (error) {
        return {
            state: 400,
            error: error
        };
    }
}
