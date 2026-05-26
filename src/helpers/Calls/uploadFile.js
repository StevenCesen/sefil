export default async function uploadFile({data}){
    try {
        const request=await fetch(`${import.meta.env.VITE_URL_BASE}/upload`,{
            method:'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body:data
        });

        if (request.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
            return null;
        }

        const response=await request.json();
        return response;

    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}