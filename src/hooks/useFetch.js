const useFetch = () => {

    const logout = () => {
        // Limpiar todos los datos del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('temp_uS');
        localStorage.removeItem('name');
        localStorage.removeItem('extension');
        localStorage.removeItem('phone_number');
        localStorage.removeItem('timestamp_cc');
        localStorage.removeItem('estado');
        localStorage.removeItem('change_ps');

        // Redirigir al login
        window.location.href = '/';
    };

    const fetchWithAuth = async (url, options = {}) => {
        // Agregar el token de autenticación por defecto
        const defaultHeaders = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);

            // Si el código es 401 (no autorizado), cerrar sesión
            if (response.status === 401) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                logout();
                throw new Error('Unauthorized - Session expired');
            }

            // Si el código es 403 (prohibido)
            if (response.status === 403) {
                throw new Error('Forbidden - Access denied');
            }

            return response;
        } catch (error) {
            if (error.message === 'Unauthorized - Session expired') {
                throw error;
            }

            console.error('Error en la petición:', error);
            throw error;
        }
    };

    return { fetchWithAuth, logout };
};

export default useFetch;
