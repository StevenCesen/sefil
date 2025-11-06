import { useEffect, useState } from "react";
import CardStructure from "../CardStructure/CardStructure";
import "./CardActivity.css";
import ResumeCondonation from "../ResumeCondonation/ResumeCondonation";
import { useStoreManagement } from "../../../stores/useStoreManagement";

export default function CardActivity({items}){
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