export default async function cancelInvoice({ credit_id }) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_URL_BASE}/invoices/cancel`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ credit_id })
            }
        );

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al cancelar gasto de cobranza:', error);
    }
}
