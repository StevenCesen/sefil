import { useState, useEffect } from 'react';
import useFetch from './useFetch';

/**
 * Custom hook to fetch and manage agencies from the API
 * @returns {Object} { agencies: Array, loading: Boolean, error: String|null }
 */
export const useAgencies = () => {
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchWithAuth } = useFetch();

    useEffect(() => {
        let isMounted = true;

        const fetchAgencies = async () => {
            try {
                setLoading(true);
                const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/agencies`);
                const data = await response.json();

                if (!isMounted) return;
                if (data.code === 1 && data.result?.data) {
                    // Extract only the names from the agency objects
                    const agencyNames = data.result.data.map(agency => agency.name);
                    setAgencies(agencyNames);
                    setError(null);
                } else {
                    console.error('Invalid response structure:', data);
                    setError(data.message || 'Error al obtener agencias');
                    setAgencies([]);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error('Error fetching agencies:', err);
                setError('Error de conexión al obtener agencias');
                setAgencies([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAgencies();

        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array - only fetch once on mount

    return { agencies, loading, error };
};

export default useAgencies;