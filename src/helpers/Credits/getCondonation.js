export default async function getCondonation({ id }) {
    const end_point = `${import.meta.env.VITE_URL_BASE}/condonations/${id}`;
    try {
        const request = await fetch(end_point, {
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

        if (!request.ok) {
            throw new Error('Error al consultar la condonación');
        }

        const data = await request.json();
        return data;

    } catch (error) {
        console.error('Error al obtener condonación:', error);
        return { code: -1, message: 'Error al obtener condonación', result: null };
    }
}
