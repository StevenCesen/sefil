import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MenuNav from "../../components/Tools/MenuNav/MenuNav";
import CardActions from "../../components/Credits/CardActions/CardActions";
import "./Credit.css";
import getCredit from "../../helpers/Credits/getCredit";
import { useStoreManagement } from "../../stores/useStoreManagement";
import InfoCredit from "../../components/Credits/InfoCredit/InfoCredit";
import InfoValues from "../../components/Credits/InfoValues/InfoValues";
import InfoPending from "../../components/Credits/InfoPending/InfoPending";
import InfoFees from "../../components/Credits/InfoFees/InfoFees";
import CardClient from "../../components/Credits/CardClient/CardClient";
import CardPay from "../../components/CardPay/CardPay";
import CardConfirm from "../../components/CardConfirm/CardConfirm";
import { useStoreCondonation } from "../../stores/useStoreCondonation";
import { useStoreLoader } from "../../stores/useStoreLoader";
import { useStoreStructure } from "../../stores/useStoreStructure";
import CardActivity from "../../components/Credits/CardActivity/CardActivity";
import HistorialNav from "../../components/Tools/HistorialNav/HistorialNav";
import ViewPDFCondonation from "../../components/Credits/ViewPDFCondonation/ViewPDFCondonation";
import ViewPDFStructure from "../../components/Credits/ViewPDFStructure/ViewPDFStructure";
import ViewPDFBilling from "../../components/Credits/ViewPDFBilling/ViewPDFBilling";
import getActivity from "../../helpers/Credits/getActivity";

export default function Credit(){
    const params=useParams();
    const credit=useStoreManagement();
    const store_condonation=useStoreCondonation();
    const [items,setItems]=useState([]);
    const store_structure=useStoreStructure();
    const [action,setAction]=useState('');
    const loader = useStoreLoader();
    
    const attributes=new URLSearchParams(useLocation().search);

    const handleItems = async ({credit_id,cartera}) =>{
        const data_items = await getActivity({ credit_id,cartera });
        setItems(data_items);
    }

    const helperCredit=async ({credit_id,cartera})=>{
        loader.viewOn(true);
        credit.setIDCampain(cartera);
        const data_credit=await getCredit({credit_id,cartera});
        credit.setCredit(data_credit);
        loader.viewOn(false);
    }

    useEffect(()=>{
        helperCredit({credit_id:params.id,cartera:attributes.get('cartera')});
        handleItems({credit_id:params.id,cartera:attributes.get('cartera')});

        if(action==='GEN_CONDONATION'){
            store_condonation.setInfoCredit({
                ci:credit.credit.clients[0].ci,
                name:credit.credit.clients[0].name,
                total:credit.credit.total_amount-credit.credit.gasto_cobranza_sefil,
                capital:credit.credit.saldo_capital,
                mora:credit.credit.mora,
                interes:credit.credit.interes,
                seguro_desgravamen:credit.credit.seguro_desgravamen,
                gastos_judiciales:credit.credit.gastos_judiciales,
                gastos_cobranza_sefil:credit.credit.gasto_cobranza_sefil,
                gastos_cobranza:credit.credit.gastos_cobranza,
                otros_valores:credit.credit.otros_valores,
                id:credit.credit.id,
                cartera:credit.cartera
            });
        }else if(action==='GEN_CONVENIO'){
            store_structure.viewOn(true);
            store_structure.setInfoCredit({
                ci:credit.credit.clients[0].ci,
                name:credit.credit.clients[0].name,
                total_amount:credit.credit.total_amount,
                cartera:credit.cartera,
                credit_id:credit.credit.id,
                gasto_cobranza:credit.credit.gasto_cobranza_sefil
            });
        }else if(action==='GEN_JUDICIAL'){
            //  Ver después
        }
    },[action]);

    if(!credit.credit) return <></>

    return (
        <div className="Credit">
            <ViewPDFCondonation/>
            <ViewPDFStructure/>
            <ViewPDFBilling/>
            <HistorialNav/>

            <h2>Consulta de crédito</h2>

            <div className="Credit__sections">
                <div className="Credit__sectionInfo">
                    <div className="Credit__sectionClients">
                        <div>
                            {
                                credit.credit.clients.map((client)=>(
                                    <CardClient
                                        key={client.ci}
                                        name={client.name}
                                        ci={client.ci}
                                        type={client.type}
                                        sector_economico={client.sector_economico}
                                        credit_id={credit.id}
                                        days_past_due={credit.days_past_due}
                                        total_amount={credit.total_amount}
                                        actions={false}
                                    />
                                ))
                            }
                        </div>
                        <InfoCredit
                            business={credit.cartera}
                            sync_id={credit.credit.sync_id}
                            agency={credit.credit.agency}
                            frequency={credit.credit.frequency}
                            due_date={credit.credit.due_date}
                            collection_state={credit.credit.collection_state}
                            monthly_fee_amount={credit.credit.monthly_fee_amount}
                            //Información adicional
                            info_extra={
                                {
                                    monthly_fee_amount:credit.credit.monthlyFeeAmount,
                                    agent:credit.credit.agent,
                                    sync_status:credit.credit.status
                                }
                            }
                        />
                    </div>
                    <div className="Credit__sectionPending">
                        <InfoValues
                            capital={credit.credit.saldo_capital}
                            interest={credit.credit.interes}
                            mora={credit.credit.mora}
                            seguro={credit.credit.seguro_desgravamen}
                            gasto_cobranza_sefil={credit.credit.gasto_cobranza_sefil}
                            gasto_cobranza={credit.credit.gastos_cobranza}
                            gastos_judiciales={credit.credit.gastos_judiciales}
                            otros_valores={credit.credit.otros_valores}
                        />
                        <div>
                            <InfoPending
                                days_past_due={credit.credit.days_past_due}
                                total_amount={credit.credit.total_amount}
                                payment_date={('payment_date' in credit.credit) ? credit.credit.payment_date : credit.credit.paymentDate}
                            />
                            <InfoFees
                                pending_fees={credit.credit.pending_fees}
                                paid_fees={credit.credit.paid_fees}
                                total_fees={credit.credit.total_fees}
                            />
                        </div>
                    </div>
                </div>
                
                <CardActions 
                    isViewOn={
                        (
                            credit.cartera==='syncs' || 
                            credit.credit.collection_state.toLowerCase()==='cancelado' ||
                            credit.credit.collection_state.toLowerCase()==='convenio de pago'
                        ) ? false : true
                    } 
                    setAction={setAction}
                />
                
                <div style={{display:'grid',gridTemplateColumns:'70% 30%',gap:'10px'}}>
                    <MenuNav
                        options={[
                            {
                                name:'🕑 Historial de gestiones',
                                default_option:true,
                                end_point:`MANAGEMENTS`
                            },
                            {
                                name:'📞 Historial de llamadas',
                                default_option:false,
                                end_point:`CALLS`
                            },
                            {
                                name:'💰 Historial de pagos',
                                default_option:false,
                                end_point:`PAYMENTS`
                            }
                        ]}
                    />
                    <CardActivity items={items} />
                </div>

                {
                    (action==='PAY_CREDIT')
                    ?
                        
                        <CardPay
                            setView={setAction} 
                            credit={credit.credit}
                            cartera={credit.cartera}
                            updateInfoValues={()=>{}}
                            amount={null}
                        />

                    :   (action==='PAY_GASTO')
                        ?   
                            <CardConfirm
                                id={credit.credit.id}
                                cartera={credit.cartera}
                                value={credit.credit.gasto_cobranza_sefil}
                                email={''}
                                name={credit.credit.name}
                                ci={credit.credit.ci}
                                direccion={''}
                                telefono={''}
                                setGastos={()=>{}}
                                setView={setAction}
                                setPDF={()=>{}}
                            />
                        :   <></>
                }
            </div>
        </div>
    );
}