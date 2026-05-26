export default async function getCondonations({credit_id}){
    const end_point=`${import.meta.env.VITE_URL_BASE}/condonations?credit_id=${credit_id}`;
    try {
        const request=await fetch(end_point,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (request.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
            return;
        }

        if (!request.ok) {
            throw new Error('Error al consultar la API');
        }

        const data = await request.json();
        return data;

    } catch (error) {
        console.error('Error al obtener condonaciones:', error);
        return { code: -1, message: 'Error al obtener condonaciones', result: [] };
    }
}
