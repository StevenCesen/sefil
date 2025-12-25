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
import ViewPDFCondonation from "../../Credits/ViewPDFCondonation/ViewPDFCondonation";
import ViewPDFStructure from "../../Credits/ViewPDFStructure/ViewPDFStructure";

export default function PanelManagement(){
    const store_management=useStoreManagement();
    const credits=useStoreFilterManagement();
    const credit=store_management.credit;

    if(!store_management.view_panel) return null;

    if(!credit || !credit.clients || credit.clients.length === 0) {
        return null;
    }

    const handleClosePanel = () => {
        credits.numberTrays();
        store_management.setView(false);
    };

    return(
        <>
            <ViewPDFCondonation />
            <ViewPDFStructure />
            <Modal
                title={`Gestión crédito | ${store_management.message}`}
                view={store_management.view_panel}
                setView={handleClosePanel}
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
                            total_amount={(credit.collection_state === 'Vigente') ? credit.monthly_fee_amount : credit.total_amount}
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
                                    id={client.id}
                                    name={client.name}
                                    ci={client.ci}
                                    type={client.type}
                                    sector_economico={client.economic_activity}
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
                            {credit.sync_status === 'ACTIVE' && (
                                <div>
                                    <CardDial
                                        credit_id={credit.id}
                                        campain_id={store_management.campain_id}
                                        credit_status={credit.sync_status}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <FormManagement/>
                        <MenuNav
                            options={[
                                {
                                    name:'Historial de gestiones',
                                    default_option:true,
                                    end_point:`MANAGEMENTS`
                                },
                                {
                                    name:'Historial de pagos',
                                    default_option:false,
                                    end_point:`PAYMENTS`
                                },
                                {
                                    name:'Notas',
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