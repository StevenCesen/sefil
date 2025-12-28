export const transferCampaignLoad = async (campaignId, transferData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BASE}/campains/transfer/${campaignId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: new URLSearchParams(transferData)
        });
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('role');
            window.location.href = '#/login';
            return null;
        }

        return response.json();
    } catch (error) {
        console.error('Error transferring campaign load:', error);
        throw error;
    }
};
