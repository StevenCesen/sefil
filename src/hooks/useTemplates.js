import { useState, useEffect } from 'react';
import useFetch from './useFetch';

/**
 * Custom hook to fetch and manage templates from the API
 * @returns {Object} { templates: Array, loading: Boolean, error: String|null }
 */
export const useTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchWithAuth } = useFetch();

    useEffect(() => {
        let isMounted = true;

        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/templates?only_roots=true`);
                const data = await response.json();

                if (!isMounted) return;

                console.log('Templates API response:', data);

                if (data.code === 1 && data.result?.data) {
                    // Extract the template names/states from the response
                    const templateStates = data.result.data.map(template => template.name);
                    console.log('Template states extracted:', templateStates);
                    setTemplates(templateStates);
                    setError(null);
                } else {
                    console.error('Invalid response structure:', data);
                    setError(data.message || 'Error al obtener estados de gestión');
                    setTemplates([]);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error('Error fetching templates:', err);
                setError('Error de conexión al obtener estados de gestión');
                setTemplates([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTemplates();

        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array - only fetch once on mount

    return { templates, loading, error };
};

export default useTemplates;
