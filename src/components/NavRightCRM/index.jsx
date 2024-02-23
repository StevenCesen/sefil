import { useEffect, useState } from "react";
import HeaderCRM from "../NavLeftCRM/HeaderCRM";
import "./index.css";

export default function NavRightCRM(){
    
    const [viewCredit,setViewCredit]=useState();
    const [viewGarantes,setViewGarantes]=useState();
    const [viewContacts,setViewContacts]=useState();

    useEffect(()=>{
        setViewCredit(true);
        setViewGarantes(false);
        setViewContacts(false);
    },[]);

    return (
        <div className="NavRightCRM">
            <div className="NavRightCRM__content">
                <div className="NavRigthCRM__head">
                    <label>Detalle del crédito</label>
                    <button onClick={()=>{setViewCredit(!viewCredit)}}>Ver</button>
                </div>
                {
                    (viewCredit) &&
                        <div className="NavRigthCRM__info">
                            <p>Detalle del crédito</p>
                        </div>
                }
            </div>
            <div className="NavRightCRM__content">
                <div className="NavRigthCRM__head">
                    <label>Detalle de garantes</label>
                    <button onClick={()=>{setViewGarantes(!viewGarantes)}}>Ver</button>
                </div>
                {
                    (viewGarantes) &&
                        <div className="NavRigthCRM__info">
                            <p>Detalle de los garantes</p>
                        </div>
                }
            </div>
            <div className="NavRightCRM__content">
                <div className="NavRigthCRM__head">
                    <label>Contactos</label>
                    <button onClick={()=>{setViewContacts(!viewContacts)}}>Ver</button>
                </div>
                {
                    (viewContacts) &&
                        <div className="NavRigthCRM__info">
                            <p>Contactos para llamar</p>
                        </div>
                }
            </div>
        </div>
    );
}