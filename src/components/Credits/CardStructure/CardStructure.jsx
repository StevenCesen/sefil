import CardQuote from "./CardQuote";
import "./CardStructure.css";
import CardPay from "../../CardPay/CardPay";
import CardConfirm from "../../CardConfirm/CardConfirm";
import { useState } from "react";
import { useStoreManagement } from "../../../stores/useStoreManagement";

export default function CardStructure({ restruct, is_active }) {

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [showGastoCobranzaModal, setShowGastoCobranza] = useState(false);
    const [showDetails, setShowDetails] = useState(restruct.status === 'autorizado');
    const credit = useStoreManagement();

    const adjustDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        date.setHours(date.getHours() - 5);
        
        const year = date.getFullYear().toString();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleOpenPayment = (data) => {
        setPaymentData(data);
        setShowPaymentModal(true);
    }

    const handleClosePayment = () => {
        setShowPaymentModal(false);
        setPaymentData(null);
    }

    const handleOpenGastoCobranza = () => {
        setShowGastoCobranza(true);
    };

    const handleCloseGastoCobranza = (value) => {
        setShowGastoCobranza(value);
    };

    const toggleDetails = () => {
        if (restruct.status !== 'autorizado') {
            setShowDetails(!showDetails);
        }
    };

    return (
        <div className="CardStructure">
            <span className="CardStructure__subtitle">{(restruct.status === 'autorizado') ? 'CONVENIO VIGENTE' : `CONVENIO ${restruct.status}`}</span>
            <span className="CardStructure__subtitle">Usuario que genera: {restruct.byUser}</span>
            <span className="CardStructure__subtitle">Usuario que autoriza: María Bravo</span>
            <span className="CardStructure__subtitle">Realizado: {adjustDate(restruct.created_at)}</span>
            <span className="CardStructure__subtitle">Actualizado: {adjustDate(restruct.updated_at)}</span>
            
            {restruct.status !== 'autorizado' && (
                <button 
                    onClick={toggleDetails} 
                    className="CardStructure__toggleButton"
                    style={{ 
                        background: 'none', 
                        border: '1px solid #ccc', 
                        padding: '5px 10px', 
                        cursor: 'pointer',
                        color:'black',
                        marginBottom: '10px',
                        marginTop: '10px'
                    }}
                >
                    {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
                </button>
            )}

            {showDetails && (
                <div className="CardStructure__detail">
                    <div className="CardStructure__detailHead">
                        <p>Nro.</p>
                        <p>Valor</p>
                        <p>Fecha pago</p>
                        <p>Estado</p>
                    </div>
                    {
                        JSON.parse(restruct.detail).map((quote, n) => (
                            <CardQuote 
                                status={restruct.status} 
                                quote={quote} 
                                restruct={restruct}
                                n={n} 
                                key={n} 
                                onOpenPayment={handleOpenPayment}
                                onOpenGastoCobranza={handleOpenGastoCobranza}
                            />
                        ))
                    }
                </div>
            )}

            {
                showPaymentModal && paymentData && (
                    <CardPay 
                        setView={handleClosePayment} 
                        credit={credit.credit}
                        cartera={credit.cartera}
                        updateInfoValues={()=>{}}
                        amount={paymentData.amount}
                        quoteNumber={paymentData.quoteNumber}
                        paymentDate={paymentData.paymentDate}
                    />
                )
            }

            {
                showGastoCobranzaModal && (
                    <CardConfirm
                        id={credit.credit.id}
                        cartera={credit.cartera}
                        value={credit.credit.gasto_cobranza_sefil}
                        email={''}
                        name={credit.credit.name}
                        ci={credit.credit.ci}
                        direccion={''}
                        telefono={''}
                        setGastos={()=>{}}
                        setView={handleCloseGastoCobranza}
                        setPDF={()=>{}}
                    />
                )
            }

        </div>
    );
}