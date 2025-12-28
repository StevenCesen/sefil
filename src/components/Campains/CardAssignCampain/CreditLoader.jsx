import { useState, useEffect } from "react";
import { fetchCreditsData } from "../../../helpers/Campains/fetchCreditsData";
import CreditDetailsModal from "../../CreditDetailsModal/CreditDetailsModal";
import sendpush from "../../../helpers/sendpush";

export default function CreditLoader({ onCreditsChange, credits: externalCredits = { total: 0, data: [] } }) {
    const [credits, setCredits] = useState({ total: 0, data: [] });
    const [searchText, setSearchText] = useState('');
    const [view_details, setViewDetails] = useState(false);

    useEffect(() => {
        if (externalCredits) {
            setCredits(externalCredits);
        }
    }, [externalCredits]);

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    }

    const handleSearchCredits = async () => {
        if (!searchText.trim()) return;

        const entries = searchText.trim().split(/\s+/);
        const syncIds = [];
        let businessName = '';

        entries.forEach(entry => {
            const parts = entry.split('-');
            if (parts.length === 2) {
                businessName = parts[0];
                syncIds.push(parts[1]);
            }
        });

        if (syncIds.length > 0 && businessName) {
            const data = await fetchCreditsData({
                sync_ids: syncIds,
                business_name: businessName
            });

            if (data && data.code === 1 && data.result) {
                if (syncIds.length === 1 && data.result.data && data.result.data.length === 1) {
                    const credit = data.result.data[0];
                    if (credit.sync_status === 'INACTIVE') {
                        sendpush({
                            title: 'Crédito inactivo',
                            message: `El crédito con sync_id ${credit.sync_id} está inactivo en esta campaña.`,
                            type: 'Push--warning',
                            timeout: 5000
                        });
                    }
                }

                const newCredits = {
                    total: data.result.meta?.total || data.result.total || 0,
                    data: data.result.data || []
                };
                setCredits(newCredits);
                onCreditsChange?.(newCredits, true);
            }
        }
    }

    return (
        <>
            <div className="CardAssignCampain__file">
                <span>
                    Cargar datos (<strong>{credits.total || 0}</strong>)
                </span>
                <div className="CardAssignCampain__fileRow">
                    <input
                        onChange={handleSearchTextChange}
                        value={searchText}
                        type="text"
                        placeholder="Ingrese business_name-sync_id separados por espacio"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchCredits();
                            }
                        }}
                    />
                    <button onClick={handleSearchCredits}>
                        Buscar
                    </button>
                    {credits.data.length > 0 && (
                        <button onClick={() => setViewDetails(true)}>
                            Ver detalle cred.
                        </button>
                    )}
                </div>
            </div>

            <CreditDetailsModal
                isOpen={view_details}
                onClose={() => setViewDetails(false)}
                credits={credits.data}
            />
        </>
    );
}
