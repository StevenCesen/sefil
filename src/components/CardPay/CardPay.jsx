import { useEffect, useRef, useState } from "react";
import "./CardPay.css";
import { PDFViewer } from "@react-pdf/renderer";
import PDF from "../PDF";
import usePrelacion from "../../hooks/usePrelacion";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useUpdateCredit from "../../hooks/useUpdateCredit";
import { useStoreLoader } from "../../stores/useStoreLoader";
import sendpush from "../../helpers/sendpush";

const INITIAL_DETAIL = {
    totalAmount: 0,
    saldo_capital: 0,
    interes: 0,
    mora: 0,
    seguro_desgravamen: 0,
    gastos_cobranza: 0,
    gastos_judiciales: 0,
    otros_valores: 0
};

const FINANCIAL_INSTITUTIONS = [
    { value: "", label: "-- Seleccionar --" },
    { value: "Banco de Loja | AHORROS", label: "Banco de Loja | AHORROS" },
    { value: "Banco de Loja | CORRIENTE", label: "Banco de Loja | CORRIENTE" },
    { value: "Banco Pichincha | AHORROS", label: "Banco Pichincha | AHORROS" },
    { value: "SERVIPAGOS_BL", label: "SERVIPAGOS_BL" },
    { value: "PAGO ÁGIL_BL", label: "PAGO ÁGIL_BL" },
    { value: "CACPE Loja", label: "CACPE Loja" },
    { value: "BanEcuador", label: "BanEcuador" }
];

const PAYMENT_METHODS = [
    { value: "", label: "-- Seleccionar --" },
    { value: "efectivo", label: "Efectivo" },
    { value: "deposito", label: "Depósito" },
    { value: "transferencia", label: "Transferencia" }
];

const DETAIL_LABELS = {
    saldo_capital: 'Capital',
    interes: 'Interés',
    mora: 'Mora',
    seguro_desgravamen: 'Seguro desgravamen',
    gastos_cobranza: 'Gastos de cobranza',
    gastos_judiciales: 'Gastos judiciales',
    otros_valores: 'Otros valores',
    totalAmount: 'Total'
};

export default function CardPay({ setView, cartera, credit, updateInfoValues, amount, quoteNumber, paymentDate }) {
    const [payment, setPayment] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [voucher, setVoucher] = useState(null);
    const [prelacion, setPrelacion] = useState(INITIAL_DETAIL);
    const [ordenPrelacion, setOrdenPrelacion] = useState(null);
    const [sendData, setSendData] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    
    const titleRef = useRef();
    const valueRef = useRef();
    const loader = useStoreLoader();

    const isPresetAmount = amount !== null && amount !== undefined;
    const maxDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];

    const initializePayment = () => {
        const detail = {
            totalAmount: credit.totalAmount,
            saldo_capital: credit.saldo_capital,
            interes: credit.interes,
            mora: credit.mora,
            seguro_desgravamen: credit.seguro_desgravamen,
            gastos_cobranza: credit.gastos_cobranza,
            gastos_judiciales: credit.gastos_judiciales,
            otros_valores: credit.otros_valores
        };

        return {
            forma_pago: '',
            fecha_pago: '',
            tipo_transaccion: isPresetAmount ? 'parcial' : 'total',
            institucion_financiera: '',
            valor_devuelto: 0,
            valor_recibido: isPresetAmount ? amount : 0,
            codigo_deposito: '',
            credito: credit.id,
            detalle: detail
        };
    };

    const updateDetalle = (detalle) => {
        setPayment(prev => ({
            ...prev,
            detalle
        }));
    };

    const handleFieldChange = (field, value) => {
        if (field === 'tipo_transaccion') {
            setPayment(prev => ({ 
                ...prev, 
                [field]: value,
                valor_recibido: 0,
                valor_devuelto: 0
            }));
            
            if (valueRef.current) {
                valueRef.current.value = 0;
            }
            
            if (value === 'total') {
                setPrelacion(INITIAL_DETAIL);
            }
        } else {
            setPayment(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleReceivedValueChange = (value) => {
        if (!payment || !ordenPrelacion) return;

        const numValue = Number(value) || 0;

        if (payment.tipo_transaccion === 'parcial' || payment.tipo_transaccion === 'total') {
            const totalAmount = Number(credit.totalAmount);
            const change = numValue > totalAmount ? (numValue - totalAmount).toFixed(2) : 0;
            setPayment(prev => ({ ...prev, valor_recibido: numValue ,valor_devuelto:change}));
            if (numValue > 0) {
                usePrelacion(value, credit, setPrelacion, updateDetalle, ordenPrelacion);
            } else {
                setPrelacion(INITIAL_DETAIL);
                updateDetalle({
                    totalAmount: credit.totalAmount,
                    saldo_capital: credit.saldo_capital,
                    interes: credit.interes,
                    mora: credit.mora,
                    seguro_desgravamen: credit.seguro_desgravamen,
                    gastos_cobranza: credit.gastos_cobranza,
                    gastos_judiciales: credit.gastos_judiciales,
                    otros_valores: credit.otros_valores
                });
            }
        } else if (payment.forma_pago === 'efectivo') {
            const totalAmount = Number(credit.totalAmount);
            const change = numValue > totalAmount ? (numValue - totalAmount).toFixed(2) : 0;
            
            setPayment(prev => ({
                ...prev,
                valor_recibido: value,
                valor_devuelto: change
            }));
        }
    };

    const validatePayment = () => {
        const errors = [];
        
        if (!payment.forma_pago) errors.push('Falta forma de pago');
        if (payment.forma_pago !== 'efectivo' && !payment.institucion_financiera) {
            errors.push('Falta institución financiera');
        }
        if (payment.forma_pago !== 'efectivo' && !payment.codigo_deposito) {
            errors.push('Falta código de transacción');
        }
        if (payment.tipo_transaccion === 'total' && Number(payment.valor_recibido) < Number(credit.totalAmount)) {
            errors.push('Valor recibido no es correcto');
        }
        if (!payment.valor_recibido || payment.valor_recibido === '0') {
            errors.push('Falta valor recibido');
        }
        if (!payment.fecha_pago) errors.push('Falta fecha de pago');
        
        return errors;
    };

    const processPayment = async (button) => {
        const errors = validatePayment();
        if (errors.length > 0) {
            button.textContent = `Error: ${errors[0]}`;
            setTimeout(() => button.textContent = 'Registrar pago', 3000);
            return;
        }

        button.textContent = 'Registrando pago...';
        
        try {
            const paymentData = {
                ...payment,
                cartera,
                prevDates: JSON.stringify({
                    mora: credit.mora,
                    interes: credit.interes,
                    seguro_desgravamen: credit.seguro_desgravamen,
                    gastos_judiciales: credit.gastos_judiciales,
                    saldo_capital: credit.saldo_capital,
                    gastos_cobranza: credit.gastos_cobranza,
                    totalAmount: credit.totalAmount,
                    otros_valores: credit.otros_valores
                })
            };

            if (payment.tipo_transaccion === 'parcial') {
                const valorRecibido = valueRef.current?.value || payment.valor_recibido;
                Object.assign(paymentData, {
                    valor_recibido: valorRecibido,
                    valor_devuelto: 0,
                    detalle: JSON.stringify({
                        ...INITIAL_DETAIL,
                        saldo_capital: Math.max(0, (credit.saldo_capital - prelacion.saldo_capital)).toFixed(2),
                        interes: Math.max(0, (credit.interes - prelacion.interes)).toFixed(2),
                        mora: Math.max(0, (credit.mora - prelacion.mora)).toFixed(2),
                        seguro_desgravamen: Math.max(0, (credit.seguro_desgravamen - prelacion.seguro_desgravamen)).toFixed(2),
                        gastos_cobranza: Math.max(0, (credit.gastos_cobranza - prelacion.gastos_cobranza)).toFixed(2),
                        gastos_judiciales: Math.max(0, (credit.gastos_judiciales - prelacion.gastos_judiciales)).toFixed(2),
                        otros_valores: Math.max(0, (credit.otros_valores - prelacion.otros_valores)).toFixed(2),
                        totalAmount: Math.max(0, (credit.totalAmount - prelacion.totalAmount)).toFixed(2)
                    }),
                    saldo_capital: Math.max(0, (prelacion.saldo_capital)).toFixed(2),
                    interes: Math.max(0, (prelacion.interes)).toFixed(2),
                    mora: Math.max(0, (prelacion.mora)).toFixed(2),
                    seguro_desgravamen: Math.max(0, (prelacion.seguro_desgravamen)).toFixed(2),
                    gastos_cobranza: Math.max(0, (prelacion.gastos_cobranza)).toFixed(2),
                    gastos_judiciales: Math.max(0, (prelacion.gastos_judiciales)).toFixed(2),
                    otros_valores: Math.max(0, (prelacion.otros_valores)).toFixed(2),
                    totalAmount: Math.max(0, (prelacion.totalAmount)).toFixed(2)
                });
            } else {
                paymentData.detalle = JSON.stringify(INITIAL_DETAIL);
                if (payment.forma_pago === 'efectivo') {
                    paymentData.valor_recibido = valueRef.current?.value || payment.valor_recibido;
                } else {
                    paymentData.valor_recibido = Number(credit.totalAmount) + Number(payment.valor_devuelto);
                }
            }

            if (payment.forma_pago !== 'efectivo') {
                const verifyResponse = await fetch(
                    `${import.meta.env.VITE_URL_BASE}/vouchers/verify?institucion=${paymentData.institucion_financiera}&codigo=${paymentData.codigo_deposito.trim()}`
                );
                const verifyData = await verifyResponse.json();
                
                if (verifyData.state !== 200) {
                    throw new Error('Código de depósito repetido');
                }
            }

            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/credit/pay/${credit.id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: new URLSearchParams(paymentData)
            });

            const result = await response.json();
            
            if (result.status === 200) {
                setVoucher({ id: result.id, sync: result.sync });
                setSendData(paymentData);
                button.textContent = 'Pago registrado';
                titleRef.current.textContent = 'COMPROBANTE DE PAGO';
                setIsActive(false);
                useUpdateCredit(cartera, credit.id, () => {});
                
                sendpush({
                    title: 'Pago registrado',
                    message: 'El pago se ha registrado correctamente',
                    type: 'Push--successful',
                    timeout: 3000
                });
            } else {
                throw new Error('Error al procesar el pago');
            }
        } catch (error) {
            button.textContent = error.message || 'Error, inténtalo de nuevo';
            setTimeout(() => button.textContent = 'Registrar pago', 3000);
            
            sendpush({
                title: 'Error en el pago',
                message: error.message || 'No se pudo procesar el pago',
                type: 'Push--danger',
                timeout: 5000
            });
        }
    };

    useEffect(() => {
        if (isInitialized || !credit?.id) return;

        const init = async () => {
            loader.viewOn(true);
            setPayment(initializePayment());
            
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_URL_BASE}/businesses/${cartera}`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                const businessData = await response.json();
                const backendPrelacionOrder = businessData?.result?.prelation_order || businessData?.prelation_order;

                // Mapear los nombres del backend a los nombres del frontend
                const BACKEND_TO_FRONTEND_MAP = {
                    'mora': 'mora',
                    'interest': 'interes',
                    'safe': 'seguro_desgravamen',
                    'legal_expenses': 'gastos_judiciales',
                    'other_values': 'otros_valores',
                    'capital': 'saldo_capital',
                    'collection_expenses': 'gastos_cobranza'
                };

                // Transformar el orden de prelación
                let prelacionOrder;
                if (backendPrelacionOrder && Array.isArray(backendPrelacionOrder)) {
                    prelacionOrder = backendPrelacionOrder.map(field => BACKEND_TO_FRONTEND_MAP[field] || field);
                } else if (typeof backendPrelacionOrder === 'string') {
                    const parsed = JSON.parse(backendPrelacionOrder);
                    prelacionOrder = parsed.map(field => BACKEND_TO_FRONTEND_MAP[field] || field);
                } else {
                    // Orden por defecto si no hay prelación configurada
                    prelacionOrder = ['mora', 'interes', 'seguro_desgravamen', 'gastos_judiciales', 'otros_valores', 'saldo_capital', 'gastos_cobranza'];
                }

                setOrdenPrelacion(prelacionOrder);

                if (isPresetAmount && amount > 0) {
                    usePrelacion(amount, credit, setPrelacion, updateDetalle, prelacionOrder);
                }
                
                setIsInitialized(true);
            } catch (error) {
                console.error('Error loading prelacion:', error);
            } finally {
                loader.viewOn(false);
            }
        };

        init();
    }, [credit?.id, cartera]);

    useEffect(() => {
        if (isPresetAmount && valueRef.current && isInitialized) {
            valueRef.current.value = amount;
        }
    }, [amount, isInitialized, isPresetAmount]);

    if (!payment || !ordenPrelacion || !isInitialized) {
        return null;
    }

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={() => setView('')}>
                Volver
            </button>
            
            <div className="CardPay__contentPay">
                <div className="CardPay__head">
                    <h3 ref={titleRef}>PAGO</h3>
                    <img src="./icons/logo.png" alt="Logo" />
                </div>
                
                <div className="CardPay__detailPay">
                    <div>
                        <p><label>Tipo de transacción:</label></p>
                        {isActive ? (
                            <select 
                                value={payment.tipo_transaccion}
                                onChange={(e) => handleFieldChange('tipo_transaccion', e.target.value)}
                            >
                                <option value="total">Pago total</option>
                                <option value="parcial">Pago parcial</option>
                            </select>
                        ) : (
                            <p>{payment.tipo_transaccion.toUpperCase()}</p>
                        )}
                    </div>

                    <div>
                        <p><label>Forma de pago:</label></p>
                        <select 
                            value={payment.forma_pago}
                            onChange={(e) => handleFieldChange('forma_pago', e.target.value)}
                            disabled={!isActive}
                        >
                            {PAYMENT_METHODS.map(method => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {payment.forma_pago && payment.forma_pago !== 'efectivo' && (
                        <div>
                            <p><label>Institución financiera:</label></p>
                            <select 
                                value={payment.institucion_financiera}
                                onChange={(e) => handleFieldChange('institucion_financiera', e.target.value)}
                                disabled={!isActive}
                            >
                                {FINANCIAL_INSTITUTIONS.map(inst => (
                                    <option key={inst.value} value={inst.value}>
                                        {inst.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {payment.forma_pago && payment.forma_pago !== 'efectivo' && (
                        <div>
                            <p><label>Código de depósito/transferencia:</label></p>
                            <input 
                                type="text"
                                value={payment.codigo_deposito}
                                onChange={(e) => handleFieldChange('codigo_deposito', e.target.value.trim())}
                                disabled={!isActive}
                            />
                        </div>
                    )}

                    <div>
                        <p><label>Fecha de depósito:</label></p>
                        <input 
                            type="date"
                            value={payment.fecha_pago}
                            max={maxDate}
                            onChange={(e) => handleFieldChange('fecha_pago', e.target.value)}
                            disabled={!isActive}
                        />
                    </div>

                    <div>
                        <p><label>Nombre:</label></p>
                        <p>{credit.name}</p>
                    </div>
                    <div>
                        <p><label>Cédula:</label></p>
                        <p>{credit.ci}</p>
                    </div>

                    {Object.entries(payment.detalle)
                        .filter(([key]) => key in DETAIL_LABELS)
                        .map(([key, value]) => (
                            <div key={key}>
                                <p><label>{DETAIL_LABELS[key]}:</label></p>
                                <p>{useFormatterNumber({ value, currency: 'USD' })}</p>
                            </div>
                        ))
                    }

                    <div>
                        <p><label>Valor recibido:</label></p>
                        <input 
                            type="number"
                            step="0.01"
                            placeholder="0"
                            ref={valueRef}
                            defaultValue={payment.valor_recibido}
                            onChange={(e) => handleReceivedValueChange(e.target.value)}
                            disabled={!isActive}
                        />
                    </div>

                    <div>
                        <p><label>Diferencia</label></p>
                        <input 
                            type="number"
                            step="0.01"
                            value={Number(payment.valor_devuelto).toFixed(2)}
                            disabled={true}
                            onChange={(e) => handleFieldChange('valor_devuelto', e.target.value)}
                        />
                    </div>
                </div>

                {isActive && (
                    <button 
                        className="CardPay__button" 
                        onClick={(e) => processPayment(e.target)}
                    >
                        Registrar pago
                    </button>
                )}
            </div>
            
            {!isActive && voucher && sendData && (
                <PDFViewer width="500px" height="500px">
                    <PDF 
                        nro_voucher={voucher.id}
                        type_print="ORIGINAL"
                        tipo_transaccion={sendData.tipo_transaccion}
                        forma_pago={sendData.forma_pago}
                        insitucion_financiera={sendData.institucion_financiera}
                        codigo_deposito={sendData.codigo_deposito}
                        name={credit.name}
                        ci={credit.ci}
                        credito={voucher.sync}
                        mora={sendData.tipo_transaccion === 'parcial' ? JSON.parse(sendData.detalle).mora : JSON.parse(sendData.prevDates).mora}
                        interes={sendData.tipo_transaccion === 'parcial' ? JSON.parse(sendData.detalle).interes : JSON.parse(sendData.prevDates).interes}
                        seguro_desgravamen={sendData.tipo_transaccion === 'parcial' ? JSON.parse(sendData.detalle).seguro_desgravamen : JSON.parse(sendData.prevDates).seguro_desgravamen}
                        gastos_judiciales={sendData.tipo_transaccion === 'parcial' ? JSON.parse(sendData.detalle).gastos_judiciales : JSON.parse(sendData.prevDates).gastos_judiciales}
                        saldo_capital={sendData.tipo_transaccion === 'parcial' ? JSON.parse(sendData.detalle).saldo_capital : JSON.parse(sendData.prevDates).saldo_capital}
                        gastos_cobranza={sendData.tipo_transaccion === 'parcial' ? JSON.parse(sendData.detalle).gastos_cobranza : JSON.parse(sendData.prevDates).gastos_cobranza}
                        otros_valores={sendData.tipo_transaccion === 'parcial' ? JSON.parse(sendData.detalle).otros_valores : JSON.parse(sendData.prevDates).otros_valores}
                        valor_recibido={sendData.valor_recibido}
                        valor_devuelto={sendData.valor_devuelto}
                        fecha={new Date().toLocaleDateString()}
                        agente={localStorage.getItem('name')?.substring(0,1) + localStorage.getItem('name')?.split(' ')[1]}
                    />
                </PDFViewer>
            )}
        </div>
    );
}