export default async function originateCall({phone_number}){

    phone_number=phone_number.replace(/\s+/g, '');

    const change_state=await fetch(`${import.meta.env.VITE_URL_BASE}/incall`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    
    const response=await change_state.json();
    
    if(response.status===200){
        try {
            const connect_asterisk=await fetch(`originate.php?exten=${phone_number}&channel=${localStorage.getItem('extension')}`);
            const state=await connect_asterisk.json();
            console.log(response);
        } catch (error) {
            
        }
    }
}