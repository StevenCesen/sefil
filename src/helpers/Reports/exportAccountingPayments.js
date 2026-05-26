export default async function exportAccountingPayments({ business_ids, group, filterType, start_date, end_date, month_name }) {
    const endpoint = `${import.meta.env.VITE_URL_BASE}/exports/accounting`;

    // Construir parámetro business_ids como array JSON
    const businessIdsParam = Array.isArray(business_ids)
        ? JSON.stringify(business_ids)
        : JSON.stringify([business_ids]);

    let url = `${endpoint}?business_ids=${encodeURIComponent(businessIdsParam)}&group=${group}`;

    if (filterType === 'range') {
        url += `&start_date=${start_date}&end_date=${end_date}`;
    } else {
        url += `&month_name=${month_name}`;
    }

    const request = await fetch(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (request.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
        return;
    }

    if (!request.ok) {
        throw new Error('Error al generar el reporte');
    }

    const blob = await request.blob();
    return blob;
}
