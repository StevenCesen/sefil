export default async function exportCampaignAssignment({ campain_id, business_ids }) {
    const params = new URLSearchParams();
    if (campain_id) {
        params.append('campain_id', Number(campain_id));
    } else if (business_ids?.length) {
        business_ids.forEach(id => params.append('business_ids[]', id));
    }

    const request = await fetch(
        `${import.meta.env.VITE_URL_BASE}/exports/campain-assignments?${params.toString()}`,
        {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );

    if (request.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
        return;
    }

    if (!request.ok) {
        throw new Error('Error al generar el reporte');
    }

    return request.blob();
}