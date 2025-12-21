export const fetchBusinessData = async (fetchWithAuth) => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/businesses`);
    return response.json();
};

export const fetchCreditsData = async (business_id, fetchWithAuth) => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/credits?business_id=${business_id}`);
    return response.json();
};

export const transferCampaignLoad = async (campaignId, transferData, fetchWithAuth) => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/campains/transfer/${campaignId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transferData)
    });
    return response.json();
};