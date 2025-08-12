export default async function getListPayments({credit_id,cartera}){
    const end_point=`${import.meta.env.VITE_URL_BASE}/vouchers/group/${credit_id}?cartera=${cartera}`;

    try {
        const request=await fetch(end_point,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!request.ok) {
            throw new Error('Error al consultar la API');
        }

        const data = await request.json();
        return data;

    } catch (error) {
        console.error('Error al hacer fetchFilteredCredits:', error);
    }
}