export default async function getCallsByManagementID({management_id}){
    const end_point = `${import.meta.env.VITE_URL_BASE}/managements/${management_id}/calls`;

    try {
        const request = await fetch(end_point, {
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

        const data = await request.json();
        return data;

    } catch (error) {
        console.error('Error al obtener llamadas por gestión:', error);
    }
}