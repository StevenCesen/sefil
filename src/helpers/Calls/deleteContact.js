export default async function deleteContact({id}){
    const end_point=`${import.meta.env.VITE_URL_BASE}/contacts/${id}`;
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
            window.location.href = '/login';
            return;
        }

        if (!request.ok) {
            throw new Error('Error al eliminar el contacto');
        }

        const data = await request.json();
        return data;

    } catch (error) {
        console.error('Error al hacer deleteContact:', error);
    }
}
