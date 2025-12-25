export default async function getTemplates(){
    const endpoint = `${import.meta.env.VITE_URL_BASE}/templates${import.meta.env.VITE_GROUP_STATES}&per_page=${import.meta.env.VITE_PER_PAGE_STATES}`;

    const request = await fetch(endpoint,{
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

    const response=await request.json();
    return response;
}