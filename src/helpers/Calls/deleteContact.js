export default async function deleteContact({id, client_identification}){
    const qs = client_identification ? `?client_identification=${encodeURIComponent(client_identification)}` : '';
    const end_point=`${import.meta.env.VITE_URL_BASE}/contacts/${id}${qs}`;
    try {
        const request=await fetch(end_point,{
            method: 'DELETE',
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
            throw new Error('Error al eliminar el contacto');
        }

        return request.json();

    } catch (error) {
        console.error('Error al hacer deleteContact:', error);
    }
}
