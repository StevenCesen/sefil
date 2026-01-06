export default async function exportAccountingPayments({ business_id, group, filterType, start_date, end_date, month_name }) {
    const endpoint = `${import.meta.env.VITE_URL_BASE}/exports/accounting`;

    let url = `${endpoint}?business_id=${business_id}&group=${group}`;

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
        window.location.href = '/login';
        return;
    }

    if (!request.ok) {
        throw new Error('Error al generar el reporte');
    }

    const blob = await request.blob();
    return blob;
}
