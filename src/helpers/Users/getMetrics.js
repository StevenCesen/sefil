export default async function getMetrics(campain_id) {
    try {
        const request = await fetch(`${import.meta.env.VITE_URL_BASE}/statistics/metrics-by-user?user_id=${localStorage.getItem('temp_uS')}&campain_id=${campain_id}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (request.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/';
            return;
        }

        if (!request.ok) {
            throw new Error('Error al consultar la API');
        }

        const response = await request.json();
        return response;
    } catch (error) {
        console.error('Error al obtener métricas:', error);
    }
}