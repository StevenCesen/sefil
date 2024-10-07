import { useContext, useEffect, useState } from "react";
import "./MenuNotifier.css";
import CardNotifierModify from "../CardNotifierModify/CardNotifierModify";
import { NavLink } from "react-router-dom";
import { NotifierContext } from "../../contexts/notifierContext";
import CardNotifierSimple from "../CardNotifierSimple/CardNotifierSimple";
import PDFcondonacion from "../PDFcondonacion";
import { PDFViewer } from "@react-pdf/renderer";

export default function MenuNotifier(){

    const [menu,setMenu]=useState(false);
    const [pusher,setPusher]=useState();
    const [view_pdf,setView]=useState();
    const [condonation,setCondonation]=useState();

    const dataContext=useContext(NotifierContext);

    useEffect(()=>{
        setMenu(false);
        setView(view_pdf);
        setCondonation([]);
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
                                        cartera={push.message.cartera}
                                        credito={push.message.credito}
                                    />
                                :
                                    <CardNotifierModify
                                        key={index}
                                        title={push.message.title}
                                        message={push.message.message}
                                        credito={push.message.credito}
                                        cartera={push.message.cartera}
                                        fecha_pago={push.message.fecha_pago}
                                        total={push.message.totalAmount}
                                        user_generate={push.message.byUser}
                                        prev_data={push.message.prev_data}
                                        current_data={push.message.current_data}
                                        id={push.message.id}
                                        name={push.message.name}
                                        ci={push.message.ci}
                                        setData={setCondonation}
                                        setPDF={setView}
                                    />
                            ))
                        }
                    </div>
            }

            {
                (view_pdf) &&
                    <div className="CardPay">
                        <button className="CardCondonacion__close" onClick={()=>{setView(false)}}>Volver</button>
                        <PDFViewer width={'800px'} height={'600px'}>
                            <PDFcondonacion
                                ci={condonation.ci}
                                credito={condonation.credito}
                                name={condonation.name}
                                fecha={condonation.fecha}
                                prevDates={condonation.prevDates}
                                postDates={condonation.postDates}
                                user_auth={localStorage.getItem('name')}
                            />
                        </PDFViewer>
                    </div>
            }

        </div>
    );
}