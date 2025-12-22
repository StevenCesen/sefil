export default async function getCredit({credit_id}){
    const end_point=`${import.meta.env.VITE_URL_BASE}/credits/${credit_id}`;

    try {
        const request=await fetch(end_point,{
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

        const data = await request.json();
        return data;

    } catch (error) {
        console.error('Error al hacer fetchFilteredCredits:', error);
    }
}