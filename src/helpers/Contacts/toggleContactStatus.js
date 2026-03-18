export default async function toggleContactStatus(contactId, newStatus) {
    const response = await fetch(`${import.meta.env.VITE_URL_BASE}/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ phone_status: newStatus })
    });

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/';
        return;
    }

    return response.json();
}
