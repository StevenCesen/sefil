import { useEffect, useState } from "react";
import CardDataShort from "../../components/CardDataShort/CardDataShort";
import CardDataStatics from "../../components/CardDataStatics/CardDataStatics";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import "./Home.css";

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Datos hardcodeados
const hardcodedData = {
    vouchers: [
        { id: 1, amount: 150.50, date: '2024-02-01' },
        { id: 2, amount: 320.75, date: '2024-02-02' },
        { id: 3, amount: 200.00, date: '2024-02-03' }
    ],
    totalDay: 1250.80,
    totalMonth: [
        { cartera: 'SEFIL 1', total: 45320.50 },
        { cartera: 'SEFIL 2', total: 38950.25 },
        { cartera: 'CARTERA A', total: 22100.75 }
    ],
    comprobantes: [
        { name: 'Comprobantes pagados', value: 1245, color: '#10b981' },
        { name: 'Comprobantes pendientes', value: 856, color: '#f59e0b' },
        { name: 'Comprobantes rechazados', value: 123, color: '#ef4444' }
    ],
    total_value: {
        nro_credits: 2547,
        total: 125680.95
    }
};

export default function Home() {
    const [vouchers, setVouchers] = useState(hardcodedData.vouchers);
    const [totalDay, setTotal] = useState(hardcodedData.totalDay);
    const [totalMonth, setMonth] = useState(hardcodedData.totalMonth);
    const [comprobantes, setComprobantes] = useState(hardcodedData.comprobantes);
    const [total_value, setTotalValue] = useState(hardcodedData.total_value);

    useEffect(() => {
        // fetch(`${import.meta.env.VITE_URL_BASE}/vouchers?fecha=2024/02&order`, {
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())
        //     .then((data) => setVouchers(data.data));

        // fetch(`${import.meta.env.VITE_URL_BASE}/vouchers/getTotalDay`, {
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())
        //     .then((data) => setTotal(data));

        // fetch(`${import.meta.env.VITE_URL_BASE}/vouchers/getTotalMonth`, {
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())
        //     .then((data) => setMonth(data));

        // fetch(`${import.meta.env.VITE_URL_BASE}/bussines/vouchers`, {
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         setComprobantes(data.data);
        //     });

        // fetch(`${import.meta.env.VITE_URL_BASE}/panel-metrics`, {
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         setTotalValue(data[0]);
        //     });
    }, []);

    if (!vouchers) return <></>
    if (!totalMonth) return <></>
    if (!comprobantes) return <></>
    if (!total_value) return <></>

    return (
        <div className="Home">
            <div className="Home__head">
                <CardDataShort
                    title="Recuperación FACES"
                    subtitle={new Date().toLocaleDateString()}
                    data={`${total_value.nro_credits} créditos con ${useFormatterNumber({ value: total_value.total, currency: "USD" })}`}
                />
                <CardDataShort
                    title="Ingresos diarios"
                    subtitle={new Date().toLocaleDateString()}
                    data={`${useFormatterNumber({ value: totalDay, currency: "USD" })}`}
                />
                {
                    totalMonth.map((total, index) => (
                        <CardDataShort
                            key={index}
                            title={`Ingresos | ${total.cartera}`}
                            subtitle={months[new Date().getMonth()]}
                            data={`${useFormatterNumber({ value: total.total, currency: "USD" })}`}
                        />
                    ))
                }
            </div>
        </div>
    );
}