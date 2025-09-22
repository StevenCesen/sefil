import { CircleDollarSign } from "lucide-react";
import "./NavMetrics.css";
import { useEffect, useState } from "react";
import getMetrics from "../../../helpers/Users/getMetrics";
import useFormatterNumber from "../../../hooks/useFormatterNumber";

export default function NavMetrics(){

    const [metric,setMetric]=useState(0);

    const handleMetric = async ()=>{
        const value = await getMetrics();
        setMetric(value[0].total);
    }

    useEffect(()=>{
        handleMetric();
    },[]);
    
    return (
        <div className="NavMetrics">
            <p><CircleDollarSign size={22} color="rgba(204, 152, 8, 1)"/> Valor recuperado {useFormatterNumber({value:metric,currency:'USD'})}</p>
        </div>
    );
}