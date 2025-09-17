import { useEffect } from "react";
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

export default function Credit(){
    const params=useParams();
    const credit=useStoreManagement();
    
    const attributes=new URLSearchParams(useLocation().search);

    const helperCredit=async ({credit_id,cartera})=>{
        credit.setIDCampain(cartera);
        const data_credit=await getCredit({credit_id,cartera});
        credit.setCredit(data_credit);
    }

    useEffect(()=>{
        helperCredit({credit_id:params.id,cartera:attributes.get('cartera')});
    },[]);

    return (
        <div className="Credit">
            <h2>Consulta de crédito</h2>

            <div className="Credit__sections">
                <div className="Credit__sectionInfo">
                    <InfoCredit
                        sync_id={credit.credit.credito}
                        agency={credit.credit.agency}
                        frequency={credit.credit.frequency}
                        due_date={credit.credit.due_date}
                        collection_state={credit.credit.collection_state}
                    />
                    <div className="Credit__sectionPending">
                        <InfoValues
                            capital={credit.credit.saldo_capital}
                            interest={credit.credit.interes}
                            mora={credit.credit.mora}
                            seguro={credit.credit.seguro_desgravamen}
                            gasto_cobranza_sefil={credit.credit.gasto_cobranza}
                            gasto_cobranza={credit.credit.gasto_cobranza}
                            gastos_judiciales={credit.credit.gastos_judiciales}
                            otros_valores={credit.credit.otros_valores}
                        />
                        <div>
                            <InfoPending
                                days_past_due={credit.credit.days_past_due}
                                total_amount={credit.credit.total_amount}
                                payment_date={credit.credit.paymentDate}
                            />
                            <InfoFees
                                pending_fees={credit.credit.pending_fees}
                                paid_fees={credit.credit.paid_fees}
                                total_fees={credit.credit.total_fees}
                            />
                        </div>
                    </div>
                </div>
                
                <CardActions/>

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
            </div>
        </div>
    );
}