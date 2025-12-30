export default async function getContacts(client_ci) {
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BASE}/contacts?client_ci=${client_ci}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/';
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
}
