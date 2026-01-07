export default async function checkSMS({ client_id, credit_id, campain_id }) {
    try {
        const request = await fetch(
            `${import.meta.env.VITE_URL_BASE}/sms/check?client_id=${client_id}&credit_id=${credit_id}&campain_id=${campain_id}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        
        const response = await request.json();
        return response;
    } catch (error) {
        console.error('Error al verificar SMS:', error);
        return { error: true, message: 'Error al verificar el estado del SMS' };
    }
}
