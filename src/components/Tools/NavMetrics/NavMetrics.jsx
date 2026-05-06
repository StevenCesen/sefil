import { CircleDollarSign } from "lucide-react";
import "./NavMetrics.css";
import { useEffect, useState } from "react";
import getMetrics from "../../../helpers/Users/getMetrics";
import useFormatterNumber from "../../../hooks/useFormatterNumber";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";

export default function NavMetrics(){

    const [metric,setMetric]=useState(0);
    const campain_id = useStoreFilterManagement(state => state.campain_id);

    const handleMetric = async ()=>{
        const value = await getMetrics(campain_id);
        setMetric(value.result);
    }

    useEffect(()=>{
        handleMetric();
    },[campain_id]);
    
    return (
        <div className="NavMetrics">
            <p><CircleDollarSign size={22} color="rgba(204, 152, 8, 1)"/> Créditos: {metric.nro_credits}</p>
            <p>Valor recuperado {useFormatterNumber({value:metric.total_with_management_in_campain,currency:'USD'})}</p>
        </div>
    );
}