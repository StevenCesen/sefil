import { PDFViewer } from "@react-pdf/renderer";
import { useStoreCondonation } from "../../../stores/useStoreCondonation";
import PDFcondonacion from "../../PDFcondonacion";

export default function ViewPDFCondonation(){
    const store_condonation = useStoreCondonation();
    
    if(!store_condonation.viewPDF) return <></>
    
    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{store_condonation.setViewPDF(false)}}>Volver</button>
            <PDFViewer width={'800px'} height={'600px'}>
                <PDFcondonacion
                    //  ci={"1102557863"}
                    //  credito={"705"}
                    //  name={"RODRIGUEZ CALLE CRUZ AMADA"}
                    //  fecha={"2025/10/14 15:18:06"}
                    //  prevDates={'{"mora":"39.47","interes":"49.78","capital":"785.5","seguro_desgravamen":0,"gastos_cobranza":0,"gastos_judiciales":0,"otros_valores":"39.41"}'}
                    //  postDates={'{"capital":"785.5","mora":"0","interes":"49.78","seguro_desgravamen":0,"gastos_judiciales":0,"gastos_cobranza":0,"otros_valores":"0"}'}
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