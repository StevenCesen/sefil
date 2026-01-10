import { useEffect, useState } from "react";
import CardDataShort from "../../components/CardDataShort/CardDataShort";
import CardDataStatics from "../../components/CardDataStatics/CardDataStatics";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useFetch from "../../hooks/useFetch";
import { useStoreLoader } from "../../stores/useStoreLoader";
import "./Home.css";

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function Home() {
    const { fetchWithAuth } = useFetch();
    const loader = useStoreLoader();
    const [paymentsSummary, setPaymentsSummary] = useState(null);

    useEffect(() => {
        loadPaymentsSummary();
    }, []);

    const loadPaymentsSummary = async () => {
        loader.viewOn(true);
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/payments/summary`);
            const data = await response.json();

            if (data.code === 1 && data.result) {
                setPaymentsSummary(data.result);
            }
        } catch (error) {
            console.error('Error fetching payments summary:', error);
        } finally {
            loader.viewOn(false);
        }
    };

    if (!paymentsSummary) return <></>

    // Calcular totales
    const totalCreditsWithPayment = paymentsSummary.reduce((sum, item) => sum + item.nro_credits_with_payment, 0);
    const totalAmountMonth = paymentsSummary.reduce((sum, item) => sum + item.total_amount_by_month, 0);
    const totalAmountDay = paymentsSummary.reduce((sum, item) => sum + item.total_amount_by_day, 0);

    return (
        <div className="Home">
            <div className="Home__head">
                <CardDataShort
                    title="Resumen de Pagos"
                    subtitle={new Date().toLocaleDateString()}
                    data={`${totalCreditsWithPayment} créditos con ${useFormatterNumber({ value: totalAmountMonth, currency: "USD" })}`}
                />
                <CardDataShort
                    title="Ingresos diarios"
                    subtitle={new Date().toLocaleDateString()}
                    data={`${useFormatterNumber({ value: totalAmountDay, currency: "USD" })}`}
                />
                {
                    paymentsSummary.map((business) => (
                        <CardDataShort
                            key={business.business_id}
                            title={`Ingresos | ${business.business_name}`}
                            subtitle={months[new Date().getMonth()]}
                            data={`${business.nro_credits_with_payment} créditos con ${useFormatterNumber({ value: business.total_amount_by_month, currency: "USD" })}`}
                        />
                    ))
                }
            </div>
        </div>
    );
}