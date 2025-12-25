export default async function getAgents({campain_id}){
    const url = campain_id
        ? `${import.meta.env.VITE_URL_BASE}/monitor?campain_id=${campain_id}`
        : `${import.meta.env.VITE_URL_BASE}/monitor`;

    try {
        const request = await fetch(url, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const response = await request.json();

        // Asegurar que siempre se devuelve un array
        if (response.result?.data && Array.isArray(response.result.data)) {
            return response.result.data;
        } else if (Array.isArray(response.result)) {
            return response.result;
        } else if (Array.isArray(response)) {
            return response;
        }

        console.error('Formato de respuesta inesperado:', response);
        return [];
    } catch (error) {
        console.error('Error fetching agents:', error);
        return [];
    }
}