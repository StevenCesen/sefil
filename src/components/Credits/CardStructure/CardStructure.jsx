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
    const credit=useStoreManagement();

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

    return (
        <div className="CardStructure">
            <span className="CardStructure__subtitle">{(restruct.status === 'autorizado') ? 'CONVENIO VIGENTE' : `CONVENIO ${restruct.status}`}</span>
            <span className="CardStructure__subtitle">Realizado: {restruct.created_at}</span>
            <span className="CardStructure__subtitle">Actualizado: {restruct.updated_at}</span>
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