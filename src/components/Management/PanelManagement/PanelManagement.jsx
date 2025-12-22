import { useEffect } from "react";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import { useViewStruct } from "../../../stores/useViewStruct";
import CardClient from "../../Credits/CardClient/CardClient";
import InfoCredit from "../../Credits/InfoCredit/InfoCredit";
import InfoFees from "../../Credits/InfoFees/InfoFees";
import InfoPending from "../../Credits/InfoPending/InfoPending";
import InfoValues from "../../Credits/InfoValues/InfoValues";
import MenuNav from "../../Tools/MenuNav/MenuNav";
import Modal from "../../Tools/Modal/Modal";
import CardDial from "../CardDial/CardDial";
import FormManagement from "../FormManagement/FormManagement";
import ListContacts from "../ListContacts/ListContacts";
import "./PanelManagement.css";
import getStruct from "../../../helpers/Credits/getStruct";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import ViewPDFCondonation from "../../Credits/ViewPDFCondonation/ViewPDFCondonation";
import ViewPDFStructure from "../../Credits/ViewPDFStructure/ViewPDFStructure";

export default function PanelManagement({}){
    const store_management=useStoreManagement();
    const credits=useStoreFilterManagement();
    const restruct=useViewStruct();
    const credit=store_management.credit;

    console.log(credit);

    useEffect(()=>{
        if(credit!=null && credit.collection_state==='CONVENIO DE PAGO'){
            restruct.getStruct({
                credit_id:credit.id,
                cartera:store_management.cartera
            });
        }
    },[credit]);

    if(!store_management.view_panel) return <></>
    
    return(
        <>
            <ViewPDFCondonation />
            <ViewPDFStructure />
            <Modal
                title={`Gestión crédito | ${store_management.message}`}
                view={store_management.view_panel}
                setView={()=>{
                    credits.numberTrays();
                    store_management.setView(false);
                }}
            >
                <div className="PanelManagement">
                    <div className="PanelManagement__credit">
                        <InfoCredit
                            business={store_management.cartera}
                            sync_id={credit.sync_id}
                            agency={credit.agency}
                            frequency={credit.frequency}
                            due_date={credit.due_date}
                            collection_state={credit.collection_state}
                            monthly_fee_amount={credit.monthly_fee_amount}
                        />
                        <InfoPending
                            days_past_due={credit.days_past_due}
                            total_amount={(credit.collection_state=='Vigente') ? credit.monthly_fee_amount : credit.total_amount}
                            payment_date={credit.payment_date}
                        />
                        <InfoValues
                            capital={credit.capital}
                            interest={credit.interest}
                            mora={credit.mora}
                            seguro={credit.safe}
                            gasto_cobranza_sefil={credit.management_collection_expenses}
                            gasto_cobranza={credit.collection_expenses}
                            gastos_judiciales={credit.legal_expenses}
                            otros_valores={credit.other_values}
                        />
                        <InfoFees
                            paid_fees={credit.paid_fees}
                            pending_fees={credit.pending_fees}
                            total_fees={credit.total_fees}
                        />
                    </div>
                    <div className="PanelManagement__clients">
                        {
                            credit.clients.map((client)=>(
                                <CardClient
                                    key={client.ci}
                                    name={client.name}
                                    ci={client.ci}
                                    type={client.type}
                                    sector_economico={client.sector_economico}
                                    credit_id={credit.id}
                                    days_past_due={credit.days_past_due}
                                    total_amount={credit.total_amount}
                                    actions={true}
                                    email={client.email}
                                />
                            ))
                        }
                        <div className="PanelManagement__panelContact">
                            <ListContacts/>
                            <div>
                                <CardDial
                                    credit_id={credit.id}
                                    campain_id={store_management.campain_id}
                                    credit_status={credit.sync_status}
                                />
                                {/* {
                                    (restruct.isViewOn)
                                    ?
                                        <div style={{marginTop:"10px"}}>
                                            <span style={{fontSize:"16px"}}>{(restruct.struct.status==='autorizado') ? 'CONVENIO VIGENTE' : `CONVENIO ${restruct.struct.status}`}</span>
                                            <span style={{fontSize:"16px",display:'block'}}>Realizado {restruct.struct.fecha}</span>
                                                <div style={{marginTop:"10px",borderTop:"1px solid grey",borderLeft:"1px solid grey",borderRight:"1px solid grey"}}>
                                                <div style={{display:"grid",textAlign:"center",justifyContent:"center",alignItems:"center",gridTemplateColumns:"10% 30% 30% 30%",height:"30px",borderBottom:"1px solid grey"}}>
                                                    <p style={{fontSize:"14px",fontWeight:"bold"}}>Nro.</p>
                                                    <p style={{fontSize:"14px",fontWeight:"bold"}}>Valor</p>
                                                    <p style={{fontSize:"14px",fontWeight:"bold"}}>Fecha pago</p>
                                                    <p style={{fontSize:"14px",fontWeight:"bold"}}>Estado</p>
                                                </div>
                                                {
                                                    JSON.parse(restruct.struct.detail).map((cuota,n)=>(
                                                        <div style={{display:"grid",justifyContent:"center",alignItems:"center",gridTemplateColumns:"10% 30% 30% 30%",height:"40px",textAlign:"center",borderBottom:"1px solid grey"}}>
                                                            <p style={{fontSize:"14px"}}>{cuota.cuota}</p>
                                                            <p style={{fontSize:"14px"}}>{useFormatterNumber({value:cuota.valor,currency:'USD'})}</p>
                                                            <p style={{fontSize:"14px"}}>{('fecha_pago' in cuota) ? cuota.fecha_pago : ""}</p>
                                                            {
                                                                (cuota.estado==='PENDIENTE')
                                                                ?
                                                                    <>PENDIENTE</>
                                                                :   <p style={{fontSize:"14px"}}>{cuota.estado}</p>
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    :   
                                        (store_management.notes!=null)
                                        ?
                                            <div style={{marginTop:"20px"}}>
                                                {
                                                    store_management.notes.map((note,index)=>(
                                                        <div 
                                                            className="SectionNotes__item" 
                                                            style={{
                                                                backgroundColor:"rgb(248, 199, 199)",
                                                                borderRadius:'5px',
                                                                height:'60px',
                                                                padding:'10px'
                                                            }}>
                                                            <label>{note.fecha}</label>
                                                            <label></label>
                                                            <label>{note.concepto}</label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        :   <></>
                                } */}
                            </div>
                        </div>
                    </div>
                    <div>
                        <FormManagement/>
                        <MenuNav
                            options={[
                                {
                                    name:'🕑 Historial de gestiones',
                                    default_option:true,
                                    end_point:`MANAGEMENTS`
                                },
                                {
                                    name:'💰 Historial de pagos',
                                    default_option:false,
                                    end_point:`PAYMENTS`
                                },
                                {
                                    name:'📜 Notas',
                                    default_option:false,
                                    end_point:`NOTES`
                                }
                            ]}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}