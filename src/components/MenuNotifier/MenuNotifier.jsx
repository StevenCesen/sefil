import { useEffect, useState } from "react";
import "./MenuNotifier.css";
import { NavLink } from "react-router-dom";

export default function MenuNotifier(){

    const [menu,setMenu]=useState(false);
    const [pusher,setPusher]=useState();

    useEffect(()=>{
        setMenu(false);
        if(localStorage.getItem('pusher')!==null){
            setPusher(JSON.parse(localStorage.getItem('pusher')));
        }else{
            setPusher([])
        }
    },[]);

    if(!pusher) return <></>

    return (
        <div className="MenuNotifier">
            <img src="./icons/push.png" onClick={(e)=>{setMenu(!menu)}}/>
            {
                (localStorage.getItem('pusher')!==null) &&
                    (pusher.length>0) &&
                        <span>{pusher.length}</span>
            }
    
            {
                (menu) &&
                    <div className="MenuNotifier__contentPush">
                        {
                            pusher.map((push,index)=>(
                                <div className="MenuNotifier__push">
                                    <p>{push.message.message}</p>
                                    <NavLink>Abrir</NavLink>
                                </div>
                            ))
                        }
                        
                    </div>
            }
        </div>
    );
}