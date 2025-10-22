import { useEffect, useState } from "react";
import getActivity from "../../../helpers/Credits/getActivity";
import CardStructure from "../CardStructure/CardStructure";
import "./CardActivity.css";
import ResumeCondonation from "../ResumeCondonation/ResumeCondonation";

export default function CardActivity({credit_id,cartera}){

    const [items,setItems]=useState([]);

    const handleItems = async ({credit_id,cartera}) =>{
        const data_items = await getActivity({ credit_id,cartera });
        setItems(data_items);
    }

    useEffect(()=>{
        handleItems({credit_id,cartera});
    },[]);
    
    return (
        <div className="CardActivity">
            <h3>Actividad reciente</h3>
            {
                items.map((item)=>(
                    (item.type==='RESTRUCT')
                    ?   <CardStructure restruct={item}/>
                    :   <ResumeCondonation condonation={item}/>
                ))
            }
        </div>
    );
}