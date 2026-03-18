import { PDFViewer } from "@react-pdf/renderer";
import { useStoreCondonation } from "../../../stores/useStoreCondonation";
import PDFcondonacion from "../../PDFcondonacion";

export default function ViewPDFCondonation() {
    const store_condonation = useStoreCondonation();

    if (!store_condonation.viewPDF) return <></>

    const response = store_condonation.response;

    // Ajustar fecha restando 5 horas para hora local
    const adjustedDate = response?.created_at ? (() => {
        const [datePart, timePart] = response.created_at.split(' ');
        const [year, month, day] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');
        const date = new Date(year, month - 1, day, hour, minute, second);
        date.setHours(date.getHours() - 5);
        const adjustedYear = date.getFullYear();
        const adjustedMonth = String(date.getMonth() + 1).padStart(2, '0');
        const adjustedDay = String(date.getDate()).padStart(2, '0');
        const adjustedHour = String(date.getHours()).padStart(2, '0');
        const adjustedMinute = String(date.getMinutes()).padStart(2, '0');
        const adjustedSecond = String(date.getSeconds()).padStart(2, '0');
        return `${adjustedYear}/${adjustedMonth}/${adjustedDay} ${adjustedHour}:${adjustedMinute}:${adjustedSecond}`;
    })() : '';

    const prevDates = JSON.stringify({
        capital: Number(store_condonation.capital) || 0,
        interes: Number(store_condonation.interes) || 0,
        mora: Number(store_condonation.mora) || 0,
        seguro_desgravamen: Number(store_condonation.seguro_desgravamen) || 0,
        gastos_cobranza_sefil: Number(store_condonation.gastos_cobranza_sefil) || 0,
        gastos_cobranza: Number(store_condonation.gastos_cobranza) || 0,
        gastos_judiciales: Number(store_condonation.gastos_judiciales) || 0,
        otros_valores: Number(store_condonation.otros_valores) || 0
    });

    const postDates = JSON.stringify({
        capital: Number(response?.capital || 0),
        interes: Number(response?.interest || 0),
        mora: Number(response?.mora || 0),
        seguro_desgravamen: Number(response?.safe || 0),
        gastos_cobranza_sefil: Number(response?.management_collection_expenses || 0),
        gastos_cobranza: Number(response?.collection_expenses || 0),
        gastos_judiciales: Number(response?.legal_expenses || 0),
        otros_valores: Number(response?.other_values || 0)
    });

    return (
        <div className="CardPay" style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.41)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button className="CardCondonacion__close" onClick={() => { store_condonation.setViewPDF(false) }}>Volver</button>
            <PDFViewer width={'800px'} height={'600px'}>
                <PDFcondonacion
                    ci={store_condonation.ci}
                    credito={response?.sync_id || store_condonation.id}
                    name={store_condonation.name}
                    fecha={adjustedDate}
                    prevDates={prevDates}
                    postDates={postDates}
                    invoiceValue={Number(store_condonation.invoice_value) || 0}
                    user_auth={response?.created_by || 'N/A'}
                />
            </PDFViewer>
        </div>
    );
}