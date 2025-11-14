import { NavLink, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getListPayments from "../../helpers/Payments/getListPayments";
import { useStoreManagement } from "../../stores/useStoreManagement";
import SectionPayments from "../../components/Management/SectionPayments/SectionPayments";
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

    const history = window.history;

    useEffect(() => {
        handlePayments();
    },[]);

    if(!payments) return <></>

    return (
        <div className="Payments">
            <div className="DetailCredit__head">
                <NavLink 
                    to="" 
                    onClick={(e) => {
                        e.preventDefault();
                        history.go(-1);
                    }}
                >
                    Regresar
                </NavLink>
            </div>

            <p className="Payments__text"><strong>CARTERA: </strong> {cartera} </p>
            <p className="Payments__text"><strong>TITULAR: </strong> {name} </p>
            <p className="Payments__text"><strong>CÉDULA: </strong> {ci} </p>
                    
            <div>
                {payments.length > 0 ? (
                    <SectionPayments
                        payments={payments}
                        credit={credit.credit || {}}
                        view_complete_info={true}
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