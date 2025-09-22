export default async function getMetrics() {
    const request = await fetch(`${import.meta.env.VITE_URL_BASE}/metrics?agente=${localStorage.getItem('temp_uS')}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    const response = await request.json();
    return response;
}