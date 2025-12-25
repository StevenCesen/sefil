export default async function originateCall({phone_number}){

    phone_number=phone_number.replace(/\s+/g, '');

    const change_state=await fetch(`${import.meta.env.VITE_URL_PBX}/calls/dial`,{
        method:'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body:new URLSearchParams({
            channel:localStorage.getItem('extension'),
            exten:phone_number,
            context:'from-internal',
            priority:1,
            callerid:localStorage.getItem('extension'),
            timeout:30000
        })
    });

    if (change_state.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
    }

    const response=await change_state.json();
    return response;
}