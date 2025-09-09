import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MenuNav from "../../components/Tools/MenuNav/MenuNav";
import CardActions from "../../components/Credits/CardActions/CardActions";
import "./Credit.css";

export default function Credit(){
    const params=useParams();
    
    const [credit,setCredit]=useState({
        id:1,
        sync_id:'202487173',
        business_name:'SEFIL_1',
        total_amount:1759.20,
        days_past_due:20,
        business_name:'FACES',
        province:'LOJA',
        canton:'LOJA',
        parroquia:'SUCRE',
        sync_status:'ACTIVO',
        collection_state:'Vencido',
        total_fees:10,
        paid_fees:7,
        frequency:'Mensual (30 DIAS)',
        agency:'PASAJE',
        monthly_fee_amount:0.00,
        capital:1000.20,
        interest:36.38,
        mora:50.00,
        life_insurance:0.00,
        me_collection_expenses:0.00,
        other_collection_expenses:0.00,
        legal_expenses:0.00,
        other_values:0.00,
        clients:[
            {
                id:1,
                name:'JUAN RIOFRIO',
                type:'TITULAR',
                ci:'1103381982'
            },
            {
                id:2,
                name:'JUAN RIOFRIO 2',
                type:'GARANTE',
                ci:'1103382819'
            }
        ]
    });

    useEffect(()=>{

    },[]);

    return (
        <div className="Credit">
            <h2>Información de crédito</h2>

            <div className="Credit__sections">
                <div className="Credit__sectionInfo">
                    
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