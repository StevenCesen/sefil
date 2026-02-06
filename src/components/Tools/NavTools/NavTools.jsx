import { useEffect, useState } from "react";
import "./NavTools.css";
import { ToolCase } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import { useStoreStructure } from "../../../stores/useStoreStructure";
import { useStoreCondonation } from "../../../stores/useStoreCondonation";
import useVerifyStruct from "../../../hooks/useVerifyRestruct";
import sendpush from "../../../helpers/sendpush";

export default function NavTools(){
    
    const [view,setView]=useState(false);
    const credit=useStoreManagement();
    const store_structure=useStoreStructure();
    const store_condonation=useStoreCondonation();

    return (
        <div className="NavTools">
            <button onClick={()=>{setView(!view)}} className="NavTools__button"><ToolCase size={20}/> Acciones</button>
            {
                (view)
                ?
                    <div className="NavTools__menu">
                        <button onClick={()=>{
                            const managementExpenses = credit.credit.invoice_value || 0;
                            store_condonation.setInfoCredit({
                                ci:credit.credit.clients[0].ci,
                                name:credit.credit.clients[0].name,
                                total:credit.credit.total_amount - managementExpenses,
                                capital:credit.credit.capital,
                                mora:credit.credit.mora,
                                interes:credit.credit.interest,
                                seguro_desgravamen:credit.credit.safe,
                                gastos_judiciales:credit.credit.legal_expenses,
                                gastos_cobranza_sefil:credit.credit.management_collection_expenses - managementExpenses,
                                invoice_value:managementExpenses,
                                gastos_cobranza:credit.credit.collection_expenses,
                                otros_valores:credit.credit.other_values,
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
                                        credit_id:credit.credit.id
                                    });

                                    if(!check){
                                        const managementExpenses = credit.credit.invoice_value || 0;
                                        store_structure.viewOn(true);
                                        store_structure.setInfoCredit({
                                            ci:credit.credit.clients[0].ci,
                                            name:credit.credit.clients[0].name,
                                            total_amount:credit.credit.total_amount,
                                            cartera:credit.cartera,
                                            credit_id:credit.credit.id,
                                            gasto_cobranza:managementExpenses
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

                        <button onClick={async () => {
                            try {
                                const response = await fetch(
                                    `${import.meta.env.VITE_URL_BASE}/request-field-trips/${credit.credit.id}`,
                                    {
                                        method: 'PATCH',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                                        }
                                    }
                                );
                                const data = await response.json();
                                if (data.code === 1) {
                                    sendpush({
                                        title: 'Visita de campo',
                                        message: data.message,
                                        type: 'Push--sucessful',
                                        timeout: 5000
                                    });
                                    credit.setView(false);
                                } else {
                                    sendpush({
                                        title: 'Error',
                                        message: data.message || 'Error al solicitar visita de campo',
                                        type: 'Push--danger',
                                        timeout: 5000
                                    });
                                }
                            } catch (error) {
                                sendpush({
                                    title: 'Error',
                                    message: 'Error al solicitar visita de campo',
                                    type: 'Push--danger',
                                    timeout: 5000
                                });
                            }
                        }}>Solicitar visita campo</button>
                    </div>
                :   <></>
            }
        </div>
    );
}