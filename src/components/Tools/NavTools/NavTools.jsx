import { useEffect, useState } from "react";
import "./NavTools.css";
import { ToolCase } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import { useStoreStructure } from "../../../stores/useStoreStructure";
import { useStoreCondonation } from "../../../stores/useStoreCondonation";
import useVerifyStruct from "../../../hooks/useVerifyRestruct";
import sendpush from "../../../helpers/sendpush";
import getStruct from "../../../helpers/Credits/getStruct";
import { useViewStruct } from "../../../stores/useViewStruct";

export default function NavTools(){
    
    const [view,setView]=useState(false);
    const credit=useStoreManagement();
    const store_structure=useStoreStructure();
    const store_condonation=useStoreCondonation();
    const view_structure=useViewStruct();

    return (
        <div className="NavTools">
            <button onClick={()=>{setView(!view)}} className="NavTools__button"><ToolCase size={20}/> Acciones</button>
            {
                (view)
                ?
                    <div className="NavTools__menu">
                        <button onClick={()=>{
                            store_condonation.setInfoCredit({
                                total:credit.credit.total_amount-credit.credit.gasto_cobranza_sefil,
                                capital:credit.credit.saldo_capital,
                                mora:credit.credit.mora,
                                interes:credit.credit.interes,
                                seguro_desgravamen:credit.credit.seguro_desgravamen,
                                gastos_judiciales:credit.credit.gastos_judiciales,
                                gastos_cobranza:credit.credit.gastos_cobranza,
                                otros_valores:credit.credit.otros_valores,
                                id:credit.credit.id,
                                cartera:credit.cartera
                            });

                            store_condonation.viewOn(true);

                        }}>Condonación</button>

                        {
                            (credit.credit.collection_state==='CONVENIO DE PAGO')
                            ?
                                <></>
                            :   
                                <button onClick={async ()=>{
                                    const check = await useVerifyStruct({
                                        credit_id:credit.credit.id,
                                        cartera:credit.cartera
                                    });

                                    if(check){
                                        store_structure.viewOn(true);
                                        store_structure.setInfoCredit({
                                            total_amount:credit.credit.total_amount,
                                            cartera:credit.cartera,
                                            credit_id:credit.credit.id,
                                            gasto_cobranza:credit.credit.gasto_cobranza_sefil
                                        });
                                    }else{
                                        sendpush({
                                            title:'ERR: Convenio anterior.',
                                            message:'Este crédito ya tuvo un convenio, revisa el estado.',
                                            type:'Push--danger',
                                            timeout:5000
                                        });
                                    }
                                }} >Convenio de pago</button>
                        }
                    </div>
                :   <></>
            }
        </div>
    );
}