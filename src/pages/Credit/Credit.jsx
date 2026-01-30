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
import CardCondonacion from "../../components/CardCondonacion/CardCondonacion";
import CardEditJudicial from "../../components/CardEditJudicial/CardEditJudicial";
import CardStructure from "../../components/CardStructure/CardStructure";
import { useStoreCondonation } from "../../stores/useStoreCondonation";
import { useStoreLoader } from "../../stores/useStoreLoader";
import { useStoreStructure } from "../../stores/useStoreStructure";
import CardActivity from "../../components/Credits/CardActivity/CardActivity";
import HistorialNav from "../../components/Tools/HistorialNav/HistorialNav";
import ViewPDFCondonation from "../../components/Credits/ViewPDFCondonation/ViewPDFCondonation";
import ViewPDFStructure from "../../components/Credits/ViewPDFStructure/ViewPDFStructure";
import ViewPDFBilling from "../../components/Credits/ViewPDFBilling/ViewPDFBilling";
import BackButton from "../../components/BackButton/BackButton";

export default function Credit(){
    const params=useParams();
    const credit=useStoreManagement();
    const store_condonation=useStoreCondonation();
    const store_structure=useStoreStructure();
    const [action,setAction]=useState('');
    const loader = useStoreLoader();

    const location = useLocation();
    const attributes=new URLSearchParams(location.search);

    const helperCredit=async ({credit_id})=>{
        loader.viewOn(true);
        const data_credit=await getCredit({credit_id});
        if (data_credit && data_credit.result) {
            credit.setCredit(data_credit.result);
        }
        loader.viewOn(false);
    }

    useEffect(()=>{
        helperCredit({credit_id:params.id,cartera:attributes.get('cartera')});

        if(action==='GEN_CONDONATION'){
            const managementExpenses = credit.credit.management_collection_expenses || 0;
            store_structure.viewOn(false);
            store_condonation.viewOn(true);
            store_condonation.setInfoCredit({
                ci:credit.credit.clients[0].ci,
                name:credit.credit.clients[0].name,
                total:credit.credit.total_amount - managementExpenses,
                capital:credit.credit.capital,
                mora:credit.credit.mora,
                interes:credit.credit.interest,
                seguro_desgravamen:credit.credit.safe,
                gastos_judiciales:credit.credit.legal_expenses,
                gastos_cobranza_sefil:managementExpenses,
                gastos_cobranza:credit.credit.collection_expenses,
                otros_valores:credit.credit.other_values,
                id:credit.credit.id,
                cartera:credit.cartera
            });
        }else if(action==='GEN_CONVENIO'){
            const managementExpenses = credit.credit.management_collection_expenses || 0;
            store_condonation.viewOn(false);
            store_structure.viewOn(true);
            store_structure.setInfoCredit({
                ci:credit.credit.clients[0].ci,
                name:credit.credit.clients[0].name,
                total_amount:credit.credit.total_amount,
                cartera:credit.cartera,
                credit_id:credit.credit.id,
                gasto_cobranza:managementExpenses
            });
        }else if(action==='GEN_JUDICIAL'){
            //  Ver después
        }else{
            // Cerrar ambos modales cuando la acción no sea ninguna de las anteriores
            store_condonation.viewOn(false);
            store_structure.viewOn(false);
        }
    },[action]);

    if(!credit.credit) return <></>

    return (
        <div className="Credit">
            <ViewPDFCondonation/>
            <ViewPDFStructure/>
            <ViewPDFBilling/>
            <BackButton />

            <h2>Consulta de crédito</h2>

            <div className="Credit__sections">
                <div className="Credit__sectionInfo">
                    <div className="Credit__sectionClients">
                        <div>
                            {
                                credit.credit.clients.map((client)=>(
                                    <CardClient
                                        key={client.ci}
                                        id={client.id}
                                        name={client.name}
                                        ci={client.ci}
                                        type={client.type}
                                        sector_economico={client.sector_economico}
                                        credit_id={credit.credit.id}
                                        days_past_due={credit.credit.days_past_due}
                                        total_amount={credit.credit.total_amount}
                                        actions={false}
                                        showContactsButton={true}
                                    />
                                ))
                            }
                        </div>
                        <InfoCredit
                            business={credit.credit.business_name}
                            sync_id={credit.credit.sync_id}
                            agency={credit.credit.agency}
                            frequency={credit.credit.frequency}
                            due_date={credit.credit.due_date}
                            collection_state={credit.credit.collection_state}
                            monthly_fee_amount={credit.credit.monthly_fee_amount}
                            //Información adicional
                            info_extra={
                                {
                                    monthly_fee_amount:credit.credit.monthly_fee_amount,
                                    agent:credit.credit.agent_name,
                                    sync_status:credit.credit.sync_status
                                }
                            }
                        />
                    </div>
                    <div className="Credit__sectionPending">
                        <InfoValues
                            capital={credit.credit.capital}
                            interest={credit.credit.interest}
                            mora={credit.credit.mora}
                            seguro={credit.credit.safe}
                            gasto_cobranza_sefil={credit.credit.management_collection_expenses}
                            gasto_cobranza={credit.credit.collection_expenses}
                            gastos_judiciales={credit.credit.legal_expenses}
                            otros_valores={credit.credit.other_values}
                        />
                        <div>
                            <InfoPending
                                days_past_due={credit.credit.days_past_due}
                                total_amount={credit.credit.total_amount}
                                payment_date={credit.credit.payment_date}
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
                    <CardActivity showActions={true} />
                </div>

                <CardCondonacion />
                <CardStructure />

                {
                    (action==='PAY_CREDIT')
                    ?

                        <CardPay
                            setView={setAction}
                            credit={{
                                ...credit.credit,
                                totalAmount: credit.credit.total_amount,
                                saldo_capital: credit.credit.capital,
                                interes: credit.credit.interest,
                                seguro_desgravamen: credit.credit.safe,
                                gastos_cobranza: credit.credit.collection_expenses,
                                gastos_judiciales: credit.credit.legal_expenses,
                                otros_valores: credit.credit.other_values
                            }}
                            cartera={credit.credit.business_id}
                            updateInfoValues={()=>{}}
                            amount={null}
                        />

                    :   (action==='PAY_GASTO')
                        ?
                            <CardConfirm
                                id={credit.credit.id}
                                cartera={credit.cartera}
                                value={credit.credit.management_collection_expenses}
                                email={''}
                                name={credit.credit.clients[0].name}
                                ci={credit.credit.clients[0].ci}
                                direccion={''}
                                telefono={''}
                                setGastos={()=>{}}
                                setView={setAction}
                                setPDF={()=>{}}
                            />
                        :   (action==='GEN_JUDICIAL')
                            ?
                                <CardEditJudicial
                                    id={credit.credit.id}
                                    cartera={credit.credit.business_name}
                                    totalAmount={credit.credit.total_amount}
                                    gastos_judiciales={credit.credit.legal_expenses || 0}
                                    setNew={() => {
                                        helperCredit({ credit_id: params.id });
                                    }}
                                    close={() => setAction('')}
                                />
                            :   <></>
                }
            </div>
        </div>
    );
}