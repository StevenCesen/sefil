import { useContext, useEffect, useState } from "react";
import "./MenuNotifier.css";
import CardNotifierModify from "../CardNotifierModify/CardNotifierModify";
import { NavLink } from "react-router-dom";
import { NotifierContext } from "../../contexts/notifierContext";
import CardNotifierSimple from "../CardNotifierSimple/CardNotifierSimple";

export default function MenuNotifier(){

    const [menu,setMenu]=useState(false);
    const [pusher,setPusher]=useState();
    const dataContext=useContext(NotifierContext);

    useEffect(()=>{
        setMenu(false);
        setPusher(dataContext.data_push);
    },[dataContext]);

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
                                
                                (Number(push.message.action)===1)
                                ? 
                                    <CardNotifierSimple
                                        message={push.message.message}
                                        byUser={push.message.byUser}
                                        id={push.message.id}
                                    />
                                :
                                    <CardNotifierModify
                                        key={index}
                                        title={push.message.title}
                                        message={push.message.message}
                                        credito={push.message.credito}
                                        cartera={push.message.cartera}
                                        user_generate={push.message.byUser}
                                        prev_data={push.message.prev_data}
                                        current_data={push.message.current_data}
                                    />

                            ))
                        }
                        
                    </div>
            }
        </div>
    );
}