import { useState, useRef } from "react";
import { fetchCreditsData } from "../../../helpers/Campains/fetchCreditsData";
import CreditDetailsModal from "../../CreditDetailsModal/CreditDetailsModal";
import sendpush from "../../../helpers/sendpush";
import { useStoreLoader } from "../../../stores/useStoreLoader";

export default function CreditLoader({ onCreditsChange, business_ids }) {
    const [credits, setCredits] = useState({ total: 0, data: [] });
    const [view_details, setViewDetails] = useState(false);
    const debounceRef = useRef(null);
    const { viewOn } = useStoreLoader();

    const resetCredits = () => {
        const empty = { total: 0, data: [] };
        setCredits(empty);
        onCreditsChange?.(empty, false);
    };

    const handleSearchCredits = (e) => {
        const value = e.target.value;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!value.trim()) {
            resetCredits();
            return;
        }

        debounceRef.current = setTimeout(async () => {
            const entries = value.trim().split(/\s+/);
            const syncIds = [];
            let businessName = '';

            entries.forEach(entry => {
                const parts = entry.split('-');
                if (parts.length >= 2) {
                    businessName = parts[0];
                    syncIds.push(parts.slice(1).join('-'));
                }
            });

            if (syncIds.length > 300) {
                sendpush({
                    title: 'Límite excedido',
                    message: `Solo se permiten hasta 300 créditos. Ingresaste ${syncIds.length}.`,
                    type: 'Push--danger',
                    timeout: 5000
                });
                return;
            }

            if (syncIds.length > 0 && businessName) {
                viewOn(true);
                try {
                    const data = await fetchCreditsData({
                        sync_ids: syncIds,
                        business_ids: business_ids,
                        per_page: 10000
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
                } finally {
                    viewOn(false);
                }
            }
        }, 500);
    }

    return (
        <>
            <div className="CardAssignCampain__file">
                <span>
                    Cargar datos (<strong>{credits.total || 0}</strong>)
                </span>
                <div className="CardAssignCampain__fileRow">
                    <input
                        onChange={handleSearchCredits}
                        defaultValue={""}
                        type="text"
                        placeholder="Ingrese business_name-sync_id separados por espacio"
                        
                    />
                    {/* <button onClick={}>
                        Buscar
                    </button> */}
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
