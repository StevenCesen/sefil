import { useEffect, useState } from 'react';
import { fetchBusinessData } from '../helpers/Campains/fetchBusinessData';

export default function useBusinesses() {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBusinesses = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchBusinessData();

                if (data && data.result && data.result.data) {
                    setBusinesses(data.result.data);
                } else {
                    setBusinesses([]);
                }
            } catch (err) {
                console.error('Error loading businesses:', err);
                setError('Error al cargar las empresas');
                setBusinesses([]);
            } finally {
                setLoading(false);
            }
        };

        loadBusinesses();
    }, []);

    return { businesses, loading, error };
}
