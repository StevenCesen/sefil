export const fetchCreditsData = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();

        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (value !== undefined && value !== null && value !== '') {
                // Si es un array, convertirlo a JSON string
                if (Array.isArray(value)) {
                    queryParams.append(key, JSON.stringify(value));
                } else {
                    queryParams.append(key, value);
                }
            }
        });

        const response = await fetch(`${import.meta.env.VITE_URL_BASE}/credits?${queryParams.toString()}`, {
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
        console.error('Error fetching credits data:', error);
        throw error;
    }
};
