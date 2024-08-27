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
            credito:item.credito,
            totalAmount:item.totalAmount,
            pendingFees:item.pendingFees,
            dias_vencidos:item.dias_vencidos,
            collectionState:item.collectionState
        });
    },[item]);

    if(!item_data) return <></>

    return (
        <div className="CardAssignCampain__itemCharge">
            <input 
                type="checkbox"
                value={item_data.id}
                defaultChecked={false}
                onChange={(e)=>{

                }}
            />
            <label>{item_data.name}</label>
            <label>{item_data.ci}</label>
            <label
                onClick={(e)=>{
                    useClickToCopy(e.target.textContent)
                }}
            >{item_data.credito}</label>
            <label>{useFormatterNumber({value:item_data.totalAmount,currency:'USD'})}</label>
            <label>{item_data.pendingFees}</label>
            <label>{item_data.dias_vencidos}</label>
            <label>{item_data.collectionState}</label>
        </div>
    );
}