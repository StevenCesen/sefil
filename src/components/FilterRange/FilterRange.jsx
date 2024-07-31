import { useEffect, useRef, useState } from "react";
import "./FilterRange.css";

export default function FilterRange({title,key_val,filter}){
    const [filt,setFilt]=useState();
    const [key_v,setKey]=useState();
    const ref_min=useRef();
    const ref_max=useRef();
   
    useEffect(()=>{
        setKey(key_val);

        setFilt({
            min:0,  
            max:0
        });
    },[]);

    if(!filt) return <></>
    if(!key_v) return <></>

    return (
        <div className="FilterRange">
            <span>{title}</span>
            <div>
                <label>
                    min
                    <input 
                        ref={ref_min}
                        onChange={(e)=>{
                            filter(key_v,{
                                min:ref_min.current.value,
                                max:ref_max.current.value
                            });

                            setFilt({
                                ...filt,
                                min:e.target.value
                            });
                        }}
                        value={filt.min}
                        type="number"
                    />
                </label>
                
                <label>
                    max
                    <input
                        ref={ref_max}
                        onChange={(e)=>{
                            filter(key_v,{
                                min:ref_min.current.value,
                                max:ref_max.current.value
                            });
                            setFilt({
                                ...filt,
                                max:e.target.value
                            });
                        }}
                        value={filt.max}
                        type="number"
                    />
                </label>
            </div>
        </div>
    );
}