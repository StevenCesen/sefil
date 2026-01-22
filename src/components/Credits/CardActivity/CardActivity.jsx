import { useEffect, useState } from "react";
import "./CardActivity.css";
import ResumeCondonation from "../ResumeCondonation/ResumeCondonation";
import ResumeAgreement from "../ResumeAgreement/ResumeAgreement";
import getCondonations from "../../../helpers/Credits/getCondonations";
import getAgreements from "../../../helpers/Credits/getAgreements";
import { useStoreManagement } from "../../../stores/useStoreManagement";

export default function CardActivity({ showActions = true }){
    const [condonations, setCondonations] = useState([]);
    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(true);
    const credit = useStoreManagement();

    const fetchActivity = async () => {
        if(credit.credit_id) {
            setLoading(true);
            
            // Fetch condonations
            const condonationsData = await getCondonations({credit_id: credit.credit_id});
            if(condonationsData.code === 1 && condonationsData.result) {
                setCondonations(condonationsData.result);
            }
            
            // Fetch agreements
            const agreementsData = await getAgreements({credit_id: credit.credit_id});
            if(agreementsData.code === 1 && agreementsData.result) {
                setAgreements(agreementsData.result);
            }
            
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, [credit.credit_id]);

    const handleActionComplete = () => {
        fetchActivity();
    };

    if(loading) {
        return (
            <div className="CardActivity">
                <h3>Actividad reciente</h3>
                <p>Cargando...</p>
            </div>
        );
    }

    if(condonations.length === 0 && agreements.length === 0) {
        return (
            <div className="CardActivity">
                <h3>Actividad reciente</h3>
                <p>No hay actividad registrada</p>
            </div>
        );
    }

    return (
        <div className="CardActivity">
            <h3>Actividad reciente</h3>
            
            {condonations.length > 0 && (
                <>
                    <h4 style={{marginTop: '1rem', color: 'var(--color-texts)'}}>Condonaciones</h4>
                    {condonations.map((condonation)=>(
                        <ResumeCondonation
                            key={`condonation-${condonation.id}`}
                            condonation={condonation}
                            onActionComplete={handleActionComplete}
                            showActions={showActions}
                        />
                    ))}
                </>
            )}
            
            {agreements.length > 0 && (
                <>
                    <h4 style={{marginTop: '1rem', color: 'var(--color-texts)'}}>Convenios de pago</h4>
                    {agreements.map((agreement)=>(
                        <ResumeAgreement
                            key={`agreement-${agreement.id}`}
                            agreement={agreement}
                            onActionComplete={handleActionComplete}
                            showActions={showActions}
                        />
                    ))}
                </>
            )}
        </div>
    );
}