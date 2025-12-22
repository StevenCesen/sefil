export default async function getMetrics() {
    try {
        const request = await fetch(`${import.meta.env.VITE_URL_BASE}/statistics/metrics?agente=${localStorage.getItem('temp_uS')}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (request.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
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