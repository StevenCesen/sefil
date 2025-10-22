export default async function searchPayment({value,search_by}){
    let end_point=`${import.meta.env.VITE_URL_BASE}/vouchers/search/${value}`;

    if(search_by==='NRO'){
        end_point=`${import.meta.env.VITE_URL_BASE}/vouchers/code/${value}`
    }

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