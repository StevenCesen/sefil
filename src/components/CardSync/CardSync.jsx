import { useEffect, useState } from "react";
import "./CardSync.css";
import ProgressBar from "../ProgressBar/ProgressBar";

export default function CardSync(){

    const [syncs, setSyncs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPastSyncs, setShowPastSyncs] = useState(false);

    useEffect(() => {
        const fetchSyncs = () => {
            fetch(`${import.meta.env.VITE_URL_BASE}/syncs`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 1 && data.result) {
                        setSyncs(data.result);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching syncs:', error);
                    setIsLoading(false);
                });
        };

        fetchSyncs();

        const interval = setInterval(() => {
            fetchSyncs();
        }, 240000);

        return () => clearInterval(interval);
    }, []);

    const activeSyncs = syncs.filter(sync => sync.state === "IN-PROGRESS");
    const pastSyncs = syncs.filter(sync => sync.state !== "IN-PROGRESS");
    const hasActiveSyncs = activeSyncs.length > 0;
    const hasPastSyncs = pastSyncs.length > 0;

    if (isLoading) return <></>;

    return (
        <div className="CardSync">
            <div className="CardSync__container">
                <h3>Proceso de sincronización</h3>
                
                {!hasActiveSyncs ? (
                    <div className="CardSync__empty">
                        <p>No hay sincronizaciones activas</p>
                    </div>
                ) : (
                    activeSyncs.map((sync) => (
                        <div key={sync.id} className="CardSync__detail">
                            <h4>{sync.sync_type}</h4>
                            <p>{sync.state_description}</p>

                            {sync.nro_syncs && (
                                <p>Sincronizaciones: {sync.nro_syncs}</p>
                            )}

                            {sync.nro_credits && (
                                <p>Créditos: {sync.nro_credits}</p>
                            )}

                            <div className="CardSync__progress">
                                <p>Actualizando, esto puede llevar unos minutos...</p>
                                <ProgressBar isInfinite={true} />
                            </div>
                        </div>
                    ))
                )}

                {hasPastSyncs && (
                    <div className="CardSync__pastSection">
                        <button
                            className="CardSync__toggleButton"
                            onClick={() => setShowPastSyncs(!showPastSyncs)}
                        >
                            {showPastSyncs ? '▼' : '▶'} Ver sincronizaciones pasadas ({pastSyncs.length})
                        </button>

                        {showPastSyncs && (
                            <div className="CardSync__pastList">
                                {pastSyncs.map((sync) => (
                                    <div key={sync.id} className="CardSync__detail CardSync__detail--past">
                                        <h4>{sync.sync_type}</h4>
                                        <p>{sync.state_description}</p>

                                        <div className="CardSync__pastInfo">
                                            <span className={`CardSync__state CardSync__state--${sync.state.toLowerCase()}`}>
                                                {sync.state}
                                            </span>

                                            {sync.nro_syncs && (
                                                <p>Sincronizaciones: {sync.nro_syncs}</p>
                                            )}

                                            {sync.nro_credits && (
                                                <p>Créditos: {sync.nro_credits}</p>
                                            )}

                                            {sync.new_credits && (
                                                <p>Nuevos créditos: {sync.new_credits}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}