import { X } from "lucide-react";
import "./Modal.css";

export default function Modal({children,view,setView,title}){
    if(!view) return <></>

    return(
        <div className="Modal">
            <div className="Modal__head">
                <h3>{title}</h3>
                <label>
                    <X size={18} color="black" onClick={()=>{setView()}}/>
                </label>
            </div>
            {children}
        </div>
    );
}