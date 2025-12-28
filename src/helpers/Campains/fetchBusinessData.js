export const fetchBusinessData = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_URL_BASE}/businesses`, {
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
        console.error('Error fetching business data:', error);
        throw error;
    }
};
