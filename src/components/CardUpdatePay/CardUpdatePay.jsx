import { NavLink } from "react-router-dom";
import "./CardUpdatePay.css";
import { useEffect, useState } from "react";
import CardManualPay from "../CardManualPay/CardManualPay";

export default function CardUpdatePay({ name, fecha_carga, state, business_id, importedPayments }) {

    const [viewManual, setView] = useState(false);
    const [pays_denied, setPays] = useState(null);
    const [cartera, setCartera] = useState({ name: '', state: '', business_id: '' });

    const updateView = () => setView(v => !v);

    // Carga inicial: pagos con ERROR_SUM existentes para esta cartera
    useEffect(() => {
        setView(false);
        setCartera({ name, fecha_carga, state, business_id });

        fetch(`${import.meta.env.VITE_URL_BASE}/payments?payment_status=ERROR_SUM&business_id=${business_id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(r => r.json())
            .then(data => {
                if (data && data.result) {
                    setPays({ result: data.result, data: data.result, total: data.result.length, prev_page_url: null, next_page_url: null });
                } else {
                    setPays({ total: 0, data: [], result: [], prev_page_url: null, next_page_url: null });
                }
            })
            .catch(() => {
                setPays({ total: 0, data: [], result: [], prev_page_url: null, next_page_url: null });
            });
    }, []);

    // Cuando llegan pagos frescos de una importación reciente, los inyectamos
    useEffect(() => {
        if (importedPayments !== null) {
            setPays({
                result: importedPayments,
                data: importedPayments,
                total: importedPayments.length,
                prev_page_url: null,
                next_page_url: null
            });
        }
    }, [importedPayments]);

    if (!pays_denied) return <></>;

    return (
        <div className="CardListUpdateCarteras">
            <div>
                <p>{cartera.name}</p>
                <p>{cartera.state}</p>
                <p>{cartera.fecha_carga}</p>
                <p>
                    {pays_denied.result.length > 0
                        ? (
                            <div>
                                <button onClick={() => setView(true)}>
                                    Procesar {pays_denied.result.length}
                                </button>
                            </div>
                        )
                        : 0
                    }
                </p>
                <NavLink to={`${import.meta.env.VITE_URL_BASE}/nopays?cartera=${name}`}>Descargar</NavLink>
            </div>

            {viewManual && (
                <CardManualPay
                    callback={updateView}
                    pays={pays_denied}
                    cartera={name}
                    setUpdate={setPays}
                />
            )}

        </div>
    );
}
