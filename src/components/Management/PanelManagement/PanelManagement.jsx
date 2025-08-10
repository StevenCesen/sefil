import { useStoreManagement } from "../../../stores/useStoreManagement";
import CardClient from "../../Credits/CardClient/CardClient";
import InfoCredit from "../../Credits/InfoCredit/InfoCredit";
import InfoPending from "../../Credits/InfoPending/InfoPending";
import InfoValues from "../../Credits/InfoValues/InfoValues";
import MenuNav from "../../Tools/MenuNav/MenuNav";
import Modal from "../../Tools/Modal/Modal";
import CardDial from "../CardDial/CardDial";
import FormManagement from "../FormManagement/FormManagement";
import ListContacts from "../ListContacts/ListContacts";
import "./PanelManagement.css";

export default function PanelManagement({}){
    const store_management=useStoreManagement();
    const credit=store_management.credit;

    if(!store_management.view_panel) return <></>
    
    return(
        <Modal
            title={'Gestión crédito'}
            view={store_management.view_panel}
            setView={()=>{store_management.setView(false)}}
        >
            <div className="PanelManagement">
                <div className="PanelManagement__credit">
                    <InfoCredit
                        sync_id={credit.sync_id}
                        agency={credit.agency}
                        frequency={credit.frequency}
                        due_date={credit.due_date}
                        collection_state={credit.collection_state}
                    />
                    <InfoPending
                        days_past_due={credit.days_past_due}
                        total_amount={credit.total_amount}
                        payment_date={credit.payment_date}
                    />
                    <InfoValues
                        capital={credit.saldo_capital}
                        interest={credit.interes}
                        mora={credit.mora}
                        seguro={credit.seguro_desgravamen}
                        gasto_cobranza_sefil={0}
                        gasto_cobranza={credit.gastos_cobranza}
                        gastos_judiciales={credit.gastos_judiciales}
                        otros_valores={credit.otros_valores}
                    />
                </div>
                <div className="PanelManagement__clients">
                    {
                        credit.clients.map((client,n)=>(
                            <CardClient
                                key={n}
                                name={client.name}
                                ci={client.ci}
                                type={client.type}
                                credit_id={credit.id}
                            />
                        ))
                    }
                    <div className="PanelManagement__panelContact">
                        <ListContacts/>
                        <CardDial
                            credit_id={credit.id}
                            campain_id={store_management.campain_id}
                            phone_number={'0978950498'}
                            channel={'PBX'}
                        />
                    </div>
                </div>
                <div>
                    <FormManagement/>
                    <MenuNav
                        options={[
                            {
                                name:'🕑 Historial de gestiones',
                                default_option:true,
                                end_point:`${import.meta.env.VITE_URL_BASE}/managements/credits/${credit.id}`
                            },
                            {
                                name:'💰 Historial de pagos',
                                default_option:false,
                                end_point:`${import.meta.env.VITE_URL_BASE}/payments/credits/${credit.id}`
                            }
                        ]}
                    />
                </div>
            </div>
        </Modal>
    );
}