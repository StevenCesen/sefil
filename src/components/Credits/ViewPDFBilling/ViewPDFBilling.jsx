import { PDFViewer } from "@react-pdf/renderer";
import PDFgastos from "../../PDFgastos";
import { useStoreBilling } from "../../../stores/useStoreBilling";
import useFormatterNumber from "../../../hooks/useFormatterNumber";

export default function ViewPDFBilling(){

    const store_billing = useStoreBilling();
    if(!store_billing.viewPDF) return <></>

    return (
        <div className="CardPay">
            <button className="CardCondonacion__close" onClick={()=>{store_billing.setViewPDF(false)}}>Volver</button>
            <PDFViewer width={'800px'} height={'600px'}>
                <PDFgastos
                    name            =   {store_billing.name}
                    ci              =   {store_billing.ci}
                    direccion       =   {store_billing.direccion}
                    fecha           =   {store_billing.date}
                    clave_acceso    =   {store_billing.access_key}
                    valor_gasto     =   {useFormatterNumber({value:Number(store_billing.value),currency:'USD'})}
                />
            </PDFViewer>
        </div>
    );
}