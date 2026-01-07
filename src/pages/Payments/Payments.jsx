import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getListPayments from "../../helpers/Payments/getListPayments";
import { useStoreManagement } from "../../stores/useStoreManagement";
import SectionPayments from "../../components/Management/SectionPayments/SectionPayments";
import BackButton from "../../components/BackButton/BackButton";
import './Payments.css';

export default function Payments(){
    const params = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const cartera = searchParams.get('cartera');
    const name = searchParams.get('name');
    const ci = searchParams.get('ci');

    const [payments, setPayments] = useState(null);
    const credit = useStoreManagement();

    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'superadmin' || userRole === 'admin';

    const handlePayments = async () =>{
        const credit_id = params.id;
        if(credit_id && cartera){
            const paymentsData = await getListPayments({
                credit_id,
                cartera
            });
            setPayments(paymentsData || []);
        }
    }

    useEffect(() => {
        handlePayments();
    },[]);

    if(!payments) return <></>

    return (
        <div className="Payments">
            <BackButton />

            <p className="Payments__text"><strong>CARTERA: </strong> {cartera} </p>
            <p className="Payments__text"><strong>TITULAR: </strong> {name} </p>
            <p className="Payments__text"><strong>CÉDULA: </strong> {ci} </p>
                    
            <div>
                {payments.length > 0 ? (
                    <SectionPayments
                        payments={payments}
                        credit={credit.credit || {}}
                        view_complete_info={true}
                        is_admin={isAdmin}
                    />
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '20px',
                        color: '#666'
                    }}>
                        No se encontraron pagos para este crédito.
                    </div>
                )}

                {payments.length > 0 && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p>
                            {payments.length === 1 
                                ? `${payments.length} pago encontrado`
                                : `${payments.length} pagos encontrados`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}