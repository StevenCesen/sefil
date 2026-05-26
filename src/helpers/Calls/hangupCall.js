export default async function hangupCall(){
    const hangup_request = await fetch(`${import.meta.env.VITE_URL_PBX}/calls/hangup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: new URLSearchParams({
            channel: localStorage.getItem('extension').split('/')[1]
        })
    });

    if (hangup_request.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
        return;
    }

    const response = await hangup_request.json();
    console.log('hangupCall response', response);
    return response;
}