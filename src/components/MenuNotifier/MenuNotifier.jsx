import { useContext, useEffect, useState } from "react";
import "./MenuNotifier.css";
import CardNotifierModify from "../CardNotifierModify/CardNotifierModify";
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
        //  Renderizar convenios y condonaciones
        fetch(`${import.meta.env.VITE_URL_BASE}/credit/estructurar`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setPusher(data);
            });

    },[dataContext]);

    if(!pusher) return <></>

    return (
        <div className="MenuNotifier">
            <img src="./icons/push.png" onClick={(e)=>{setMenu(!menu)}}/>
            {
                <span>{(pusher.length>0) ? pusher.length : ""}</span>    
            }
    
            {
                (menu) &&
                    <div className="MenuNotifier__contentPush">
                        {
                            pusher.map((push,index)=>(
                                
                                (Number(push.action)===1) //IMPRESIÓN DE COMPROBANTES
                                ? 
                                    <CardNotifierSimple
                                        message={push.message.message}
                                        byUser={push.message.byUser}
                                        id={push.message.id}
                                        cartera={push.message.cartera}
                                        credito={push.message.credito}
                                    />
                                :
                                    <CardNotifierModify  //PARA CONVENIOS
                                        key={index}
                                        title={push.title}
                                        message={push.message}
                                        credito={push.credito}
                                        cartera={push.cartera}
                                        fecha_pago={push.fecha_pago}
                                        total={push.valor_cuota}
                                        user_generate={push.byUser}
                                        prev_data={push.prev_data}
                                        current_data={push.current_data}
                                        id={push.id}
                                        name={push.name}
                                        ci={push.ci}
                                        setData={setCondonation}
                                        setPDF={setView}
                                        setPush={setPusher}
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