export const fetchCampaignData = async (campain_id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BASE}/campains/${campain_id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
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
        console.error('Error fetching campaign data:', error);
        throw error;
    }
};
