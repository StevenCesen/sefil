import { PDFViewer } from "@react-pdf/renderer";
import PDFstructure from "../../PDFstructure";
import { useStoreStructure } from "../../../stores/useStoreStructure";

export default function ViewPDFStructure(){
    const store_structure = useStoreStructure();
    
    if(!store_structure.viewPDF) return <></>
    
    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{store_structure.setViewPDF(false)}}>Volver</button>
            <PDFViewer width={'800px'} height={'600px'}>
                <PDFstructure
                    ci={"1150575338"}
                    credito={"262"}
                    name={"STEVEN RAFAEL CESEN PACCHA"}
                    fecha={"2024/10/16 15:58:27"}
                    quotes={JSON.parse(`[{"cuota":1,"valor":42.87,"estado":"PENDIENTE","fecha_pago":"2024-11-15"},{"cuota":1,"valor":0.00,"estado":"PAGADO","fecha_pago":"2024-11-15"},{"cuota":2,"valor":139.02,"estado":"PAGADO","fecha_pago":"2024-12-13"}]`)}
                    user_auth={'Cecibel Torres'}
                    // ci={store_structure.ci}
                    // credito={store_structure.credit_id}
                    // name={store_structure.name}
                    // fecha={store_structure.response.fecha}
                    // quotes={store_structure.response.detail}
                    // user_auth={store_structure.response.byUser}
                />
            </PDFViewer>
        </div>
    );
}