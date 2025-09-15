import { X } from "lucide-react";
import "./Modal.css";
import NavTools from "../NavTools/NavTools";

export default function Modal({children,view,setView,title}){
    if(!view) return <></>

    return(
        <div className="Modal custom-scroll">
            <div className="Modal__head">
                <h3>{title}</h3>
                <div>
                    <NavTools/>
                    <label>
                        <X size={18} color="black" onClick={()=>{setView()}}/>
                    </label>
                </div>
            </div>
            {children}
        </div>
    );
}