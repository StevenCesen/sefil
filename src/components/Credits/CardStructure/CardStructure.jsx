import CardQuote from "./CardQuote";
import "./CardStructure.css";
import CardPay from "../../CardPay/CardPay";
import CardConfirm from "../../CardConfirm/CardConfirm";
import { useState } from "react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import sendpush from "../../../helpers/sendpush";

export default function CardStructure({ restruct, is_active }) {

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [showGastoCobranzaModal, setShowGastoCobranza] = useState(false);
    const [showDetails, setShowDetails] = useState(restruct.status === 'autorizado');
    const [showAnularModal, setShowAnularModal] = useState(false);
    const [motivoAnulacion, setMotivoAnulacion] = useState('');
    const [isAnulando, setIsAnulando] = useState(false);
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

    const handleOpenAnularModal = () => {
        setShowAnularModal(true);
        setMotivoAnulacion('');
    };

    const handleCloseAnularModal = () => {
        setShowAnularModal(false);
        setMotivoAnulacion('');
    };

    const handleAnularConvenio = async () => {
        if (!motivoAnulacion.trim()) {
            sendpush({
                title: 'Error',
                message: 'Debe ingresar un motivo de anulación',
                type: 'Push--danger',
                timeout: 3000
            });
            return;
        }

        setIsAnulando(true);

        try {
            const endpoint = `${import.meta.env.VITE_URL_BASE}/credit/estructurarnull/${restruct.id}`;
            
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    concept: motivoAnulacion,
                    status: 'anulado',
                    cartera: restruct.cartera,
                    credito: restruct.credito
                })
            });

            if (!response.ok) {
                throw new Error('Error al anular el convenio');
            }

            const data = await response.json();

            sendpush({
                title: 'Éxito',
                message: 'Convenio anulado correctamente',
                type: 'Push--sucessful',
                timeout: 3000
            });

            handleCloseAnularModal();
            window.location.reload();

        } catch (error) {
            console.error('Error al anular convenio:', error);
            sendpush({
                title: 'Error',
                message: 'No se pudo anular el convenio',
                type: 'Push--danger',
                timeout: 5000
            });
        } finally {
            setIsAnulando(false);
        }
    };

    return (
        <div className="CardStructure">
            <span className="CardStructure__subtitle">{(restruct.status === 'autorizado') ? 'CONVENIO VIGENTE' : `CONVENIO ${restruct.status}`}</span>
            <span className="CardStructure__subtitle">Usuario que genera: {restruct.byUser}</span>
            <span className="CardStructure__subtitle">Usuario que autoriza: María Bravo</span>
            <span className="CardStructure__subtitle">Realizado: {adjustDate(restruct.created_at)}</span>
            <span className="CardStructure__subtitle">Actualizado: {adjustDate(restruct.updated_at)}</span>
            
            {
                (restruct.status === 'autorizado' && is_active) && (
                    <button
                        className="CardStructure__button--anular" 
                        onClick={handleOpenAnularModal}
                    >
                        Anular convenio
                    </button>
                )
            }
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

            {/* Modal de Anulación */}
            {showAnularModal && (
                <div className="CardStructure__modal-overlay" onClick={handleCloseAnularModal}>
                    <div className="CardStructure__modal" onClick={e => e.stopPropagation()}>
                        <div className="CardStructure__modal-header">
                            <h3>Anular Convenio</h3>
                            <button 
                                className="CardStructure__modal-close"
                                onClick={handleCloseAnularModal}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="CardStructure__modal-body">
                            <label className="CardStructure__modal-label">
                                <span className="CardStructure__modal-icon">📝</span>
                                Motivo de anulación
                            </label>
                            <textarea
                                className="CardStructure__modal-textarea"
                                placeholder="Ingrese el motivo por el cual se anula el convenio..."
                                value={motivoAnulacion}
                                onChange={(e) => setMotivoAnulacion(e.target.value)}
                                rows={4}
                                autoFocus
                            />
                        </div>

                        <div className="CardStructure__modal-footer">
                            <button
                                className="CardStructure__modal-btn CardStructure__modal-btn--cancel"
                                onClick={handleCloseAnularModal}
                                disabled={isAnulando}
                            >
                                <span>✕</span> Cancelar
                            </button>
                            <button
                                className="CardStructure__modal-btn CardStructure__modal-btn--confirm"
                                onClick={handleAnularConvenio}
                                disabled={isAnulando || !motivoAnulacion.trim()}
                            >
                                {isAnulando ? (
                                    <>
                                        <span className="CardStructure__modal-spinner"></span>
                                        Anulando...
                                    </>
                                ) : (
                                    <>
                                        <span>✓</span> Confirmar Anulación
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
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