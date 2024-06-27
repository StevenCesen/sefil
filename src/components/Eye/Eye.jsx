import eye_on from "../../assets/icons/eye_on.png";
import eye_off from "../../assets/icons/eye_off.png";
import "./Eye.css";
import { useState } from "react";

export default function Eye({input}){

    const [state,setState]=useState(false);

    return (
        <span className="Eye" onClick={(e)=>{
            e.preventDefault();
            setState(!state)
            if(state){
                input.current.setAttribute('type','password');
            }else{
                input.current.setAttribute('type','text');
            }
        }}>
            {
                (state)     
                ?
                    <img src={eye_on}/>
                :
                    <img src={eye_off}/>       
            }
        </span>
    )
}