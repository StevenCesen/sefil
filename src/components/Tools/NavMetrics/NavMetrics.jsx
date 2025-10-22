import { CircleDollarSign } from "lucide-react";
import "./NavMetrics.css";
import { useEffect, useState } from "react";
import getMetrics from "../../../helpers/Users/getMetrics";
import useFormatterNumber from "../../../hooks/useFormatterNumber";

export default function NavMetrics(){

    const [metric,setMetric]=useState(0);

    const handleMetric = async ()=>{
        const value = await getMetrics();
        setMetric(value[0]);
    }

    useEffect(()=>{
        handleMetric();
    },[]);
    
    return (
        <div className="NavMetrics">
            <p><CircleDollarSign size={22} color="rgba(204, 152, 8, 1)"/> Créditos: {metric.nro_credits}</p>
            <p>Valor recuperado {useFormatterNumber({value:metric.total,currency:'USD'})}</p>
        </div>
    );
}