import { PDFViewer } from "@react-pdf/renderer";
import { useStoreCondonation } from "../../../stores/useStoreCondonation";
import PDFcondonacion from "../../PDFcondonacion";

export default function ViewPDFCondonation() {
    const store_condonation = useStoreCondonation();

    if (!store_condonation.viewPDF) return <></>

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={() => { store_condonation.setViewPDF(false) }}>Volver</button>
            <PDFViewer width={'800px'} height={'600px'}>
                <PDFcondonacion
                    //  ci={"0923708267"}
                    //  credito={"493"}
                    //  name={"BARROZO VERA MAYRA ALEXANDRA"}
                    //  fecha={"2025/11/06 16:40:52"}
                    //  prevDates={'{"mora":"87.47","interes":"18.89","capital":"384.69","seguro_desgravamen":0,"gastos_cobranza":0,"gastos_judiciales":0,"otros_valores":"21.74"}'}
                    //  postDates={'{"capital":"384.69","mora":"63.06","interes":"18.89","seguro_desgravamen":0,"gastos_judiciales":0,"gastos_cobranza":0,"otros_valores":"0"}'}
                    //  user_auth={'María Bravo'}
                    ci={store_condonation.ci}
                    credito={store_condonation.id}
                    name={store_condonation.name}
                    fecha={store_condonation.response.fecha}
                    prevDates={store_condonation.response.prevDates}
                    postDates={store_condonation.response.postDates}
                    user_auth={store_condonation.response.byUser}
                />
            </PDFViewer>
        </div>
    );
}