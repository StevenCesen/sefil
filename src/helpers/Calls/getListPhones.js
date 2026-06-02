export default async function getListPhones({client_identification}){
    const end_point=`${import.meta.env.VITE_URL_BASE}/contacts?client_identification=${encodeURIComponent(client_identification)}`;
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

        return request.json();

    } catch (error) {
        console.error('Error al hacer fetchFilteredCredits:', error);
    }
}