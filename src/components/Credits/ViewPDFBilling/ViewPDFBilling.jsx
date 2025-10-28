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
                    name={'STEVEN CESEN'}
                    ci={'1150575338'}
                    direccion={'LOJA'}
                    fecha={'2025/10/10 13:50:51'}
                    clave_acceso={'202388333333337693749889274893749873'}
                    valor_gasto={useFormatterNumber({value:Number('50.20'),currency:'USD'})}
                    // name            =   {store_billing.name}
                    // ci              =   {store_billing.ci}
                    // direccion       =   {store_billing.direccion}
                    // fecha           =   {store_billing.fecha}
                    // clave_acceso    =   {store_billing.clave_acceso}
                    // valor_gasto     =   {useFormatterNumber({value:Number(store_billing.valor),currency:'USD'})}
                />
            </PDFViewer>
        </div>
    );
}