export default async function revertPayment({ paymentId }) {
    try {
        const request = await fetch(`${import.meta.env.VITE_URL_BASE}/payments/revert/${paymentId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
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

    } catch (error) {
        return {
            state: 400,
            error: error
        };
    }
}
