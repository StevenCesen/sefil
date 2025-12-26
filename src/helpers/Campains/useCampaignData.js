import { useState, useEffect, useRef } from 'react';
import { fetchCampaignData, fetchCreditsData } from '../campaignHelpers';
import sendpush from '../sendpush';

export const useCampaignData = (campain_id, fetchWithAuth) => {
    const [data, setData] = useState(null);
    const [credits, setCredits] = useState({ data: [], total: 0 });
    const businessIdRef = useRef(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch campaign data
                const campaignResponse = await fetchCampaignData(campain_id, fetchWithAuth);
                const campaignData = campaignResponse?.result?.data || campaignResponse?.data || campaignResponse;

                // Update businessIdRef
                businessIdRef.current = campaignData?.business_id || campain_id;
                setData(campaignData);

                // Fetch credits data if not API type
                const creditsData = campaignData?.type !== 'api'
                    ? await fetchCreditsData(campain_id, fetchWithAuth)
                    : { data: [], total: 0 };

                const creditsResult = creditsData?.result?.data || creditsData?.data || creditsData;
                setCredits(creditsResult || { data: [], total: 0 });

                if (creditsResult) {
                    localStorage.setItem('filt', JSON.stringify(creditsResult));
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setData({ name: 'Error', totals: 0, agents: '[]', type: 'api' });
                sendpush({
                    title: 'Error.',
                    message: 'Error al cargar datos iniciales.',
                    type: 'Push--danger',
                    timeout: 5000
                });
            }
        };

        if (campain_id) {
            fetchInitialData();
        }
    }, []);

    return { data, credits, setCredits, businessIdRef };
};
