import { useEffect, useState } from "react";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import useClickToCopy from "../../hooks/useClickToCopy";

export default function CardItemCharge({item,updateCheck}){

    const [item_data,setItem]=useState();

    useEffect(()=>{
        setItem({
            id:item.id,
            name:item.name,
            ci:item.ci,
            credito:('credito' in item) ? item.credito : item.sync_id,
            totalAmount:('totalAmount' in item) ? item.totalAmount : item.total_amount,
            pendingFees:('pendingFees' in item) ? item.pendingFees : item.pending_fees,
            dias_vencidos:('dias_vencidos' in item) ? item.dias_vencidos : item.days_past_due,
            collectionState:('collectionState' in item) ? item.collectionState : item.collection_state
        });
    },[item]);

    if(!item_data) return <></>

    return (
        <div className="CardAssignCampain__itemCharge">
            <label></label>
            <label>{item_data.name}</label>
            <label>{item_data.ci}</label>
            <label
                onClick={(e)=>{
                    useClickToCopy(e.target.textContent)
                }}
            >{item_data.credito}</label>
            <label>{useFormatterNumber({value: item_data.totalAmount,currency:'USD'})}</label>
            <label>{item_data.pendingFees}</label>
            <label>{item_data.dias_vencidos}</label>
            <label>{item_data.collectionState}</label>
        </div>
    );
}