export const fetchBusinessData = async () => {
    const response = await fetch(`${import.meta.env.VITE_URL_BASE}/bussines`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.json();
};

export const fetchCreditsData = async (cartera) => {
    const response = await fetch(`${import.meta.env.VITE_URL_BASE}/credit/all?cartera=${cartera}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.json();
};

export const transferCampaignLoad = async (campaignId, filters, formData) => {
    const response = await fetch(`${import.meta.env.VITE_URL_BASE}/campains/${campaignId}?${filters}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });
    return response.json();
};