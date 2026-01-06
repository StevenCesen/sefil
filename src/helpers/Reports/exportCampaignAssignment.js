export default async function exportCampaignAssignment({ business_id }) {
    const endpoint = `${import.meta.env.VITE_URL_BASE}/exports/campain-assignments`;

    const url = `${endpoint}?business_id=${business_id}`;

    const request = await fetch(url, {
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
        throw new Error('Error al generar el reporte');
    }

    const blob = await request.blob();
    return blob;
}