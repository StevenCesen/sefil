import { useEffect, useState } from "react";
import CardUpdatePay from "../../components/CardUpdatePay/CardUpdatePay";
import BackButton from "../../components/BackButton/BackButton";
import "../pages.css";

export default function ImportPayments() {
    const [carteras, setCarteras] = useState();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL_BASE}/businesses`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    window.location.href = '/login';
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.result || !data.result.data) {
                    setCarteras([]);
                    return;
                }
                setCarteras(data.result.data);
            })
            .catch((error) => {
                console.error('Error loading businesses:', error);
                setCarteras([]);
            });
    }, []);

    if (!carteras) return <></>;

    return (
        <div className="pageConsulta">
            <BackButton />

            <div className="DetailCredit__sections">
                <div>
                    <p>Subir pagos</p>
                    <label>Formato de archivo .xlsx (EXCEL) </label>
                </div>
            </div>

            <div className="CardListUpdate__container">
                <div className="CardListUpdate__head">
                    <label>Cartera</label>
                    <label>Subir pagos</label>
                    <label>Estado</label>
                    <label>Última carga</label>
                    <label>Por procesar</label>
                    <label>Créditos sin pagos</label>
                    <label>Acciones</label>
                </div>

                {
                    carteras.map((cartera, index) => (
                        <CardUpdatePay
                            key={index}
                            fecha_carga={cartera.fecha_carga}
                            name={cartera.name}
                            state={cartera.status}
                            business_id={cartera.id}
                        />
                    ))
                }
            </div>
        </div>
    );
}
