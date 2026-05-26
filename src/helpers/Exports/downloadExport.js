export default async function downloadExport({ endpoint, params, filename }) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
        if (val !== '' && val !== null && val !== undefined) {
            query.append(key, val);
        }
    });

    const response = await fetch(
        `${import.meta.env.VITE_URL_BASE}/${endpoint}?${query}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
        return;
    }

    if (!response.ok) {
        throw new Error('Error al generar el reporte');
    }

    const disposition = response.headers.get('Content-Disposition');
    const serverFilename = disposition
        ? disposition.split('filename=')[1]?.replace(/"/g, '').trim()
        : null;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = serverFilename || filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
