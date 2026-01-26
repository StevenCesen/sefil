import { useContext, useEffect, useState } from "react";
import "./MenuNotifier.css";
import { NotifierContext } from "../../contexts/notifierContext";
import ResumeCondonation from "../Credits/ResumeCondonation/ResumeCondonation";
import ResumeAgreement from "../Credits/ResumeAgreement/ResumeAgreement";
import {
    getCachedAgreements,
    getCachedCondonations,
    isCacheValid,
    setCachedAgreements,
    setCachedCondonations,
    triggerCacheUpdate
} from "../../helpers/pendingActivitiesCache";

export default function MenuNotifier(){

    const [menu,setMenu]=useState(false);
    const [condonations, setCondonations] = useState([]);
    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(true);

    const dataContext=useContext(NotifierContext);

    const loadFromCache = () => {
        const cachedAgreements = getCachedAgreements();
        const cachedCondonations = getCachedCondonations();

        if (cachedAgreements) {
            setAgreements(cachedAgreements);
        }
        if (cachedCondonations) {
            setCondonations(cachedCondonations);
        }

        return !!(cachedAgreements || cachedCondonations);
    };

    const fetchPendingActivities = async (forceRefresh = false) => {
        // Si el cache es válido y no es un refresh forzado, usar cache
        if (!forceRefresh && isCacheValid()) {
            const hasCache = loadFromCache();
            if (hasCache) {
                setLoading(false);
                return;
            }
        }

        setLoading(true);

        try {
            // Fetch todas las condonaciones pendientes
            const condonationsResponse = await fetch(`${import.meta.env.VITE_URL_BASE}/condonations?status=PENDIENTE`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const condonationsData = await condonationsResponse.json();

            let newCondonations = [];
            if(condonationsData.code === 1 && condonationsData.result) {
                newCondonations = Array.isArray(condonationsData.result) ? condonationsData.result : [condonationsData.result];
                setCondonations(newCondonations);
                setCachedCondonations(newCondonations);
            } else {
                setCondonations([]);
                setCachedCondonations([]);
            }

            // Fetch todos los convenios pendientes
            const agreementsResponse = await fetch(`${import.meta.env.VITE_URL_BASE}/agreements?status=PENDIENTE`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const agreementsData = await agreementsResponse.json();

            let newAgreements = [];
            if(agreementsData.code === 1 && agreementsData.result) {
                newAgreements = Array.isArray(agreementsData.result) ? agreementsData.result : [agreementsData.result];
                setAgreements(newAgreements);
                setCachedAgreements(newAgreements);
            } else {
                setAgreements([]);
                setCachedAgreements([]);
            }

            // Disparar evento para sincronizar otras ventanas
            triggerCacheUpdate();
        } catch (error) {
            console.error('Error fetching pending activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActionComplete = () => {
        // Forzar refresh desde la API y actualizar cache
        fetchPendingActivities(true);
    };

    // Escuchar cambios en localStorage de otras ventanas/pestañas
    useEffect(() => {
        const handleStorageChange = (e) => {
            // Solo reaccionar a cambios en el timestamp del cache
            if (e.key === 'pending_activities_timestamp') {
                loadFromCache();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(()=>{
        setMenu(false);
        fetchPendingActivities();
    },[dataContext]);

    const totalPending = condonations.length + agreements.length;

    return (
        <div className="MenuNotifier">
            <img src="/icons/push.png" onClick={()=>{setMenu(!menu)}}/>
            {
                totalPending > 0 && <span>{totalPending}</span>
            }

            {
                (menu) &&
                    <div className="MenuNotifier__contentPush">
                        {loading ? (
                            <div style={{padding: '1rem', textAlign: 'center'}}>
                                Cargando...
                            </div>
                        ) : totalPending === 0 ? (
                            <div style={{padding: '1rem', textAlign: 'center'}}>
                                No hay actividades pendientes
                            </div>
                        ) : (
                            <>
                                {condonations.length > 0 && (
                                    <>
                                        <h4 style={{padding: '0.5rem 1rem', margin: 0, color: 'var(--color-texts)', borderBottom: '1px solid #eee'}}>
                                            Condonaciones Pendientes ({condonations.length})
                                        </h4>
                                        {condonations.map((condonation)=>(
                                            <ResumeCondonation
                                                key={`condonation-${condonation.id}`}
                                                condonation={condonation}
                                                onActionComplete={handleActionComplete}
                                            />
                                        ))}
                                    </>
                                )}

                                {agreements.length > 0 && (
                                    <>
                                        <h4 style={{padding: '0.5rem 1rem', margin: 0, color: 'var(--color-texts)', borderBottom: '1px solid #eee'}}>
                                            Convenios Pendientes ({agreements.length})
                                        </h4>
                                        {agreements.map((agreement)=>(
                                            <ResumeAgreement
                                                key={`agreement-${agreement.id}`}
                                                agreement={agreement}
                                                onActionComplete={handleActionComplete}
                                            />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
            }
        </div>
    );
}