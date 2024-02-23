import { NavLink } from "react-router-dom";
import "./CardDataList.css";
import useTotalCondonation from "../../hooks/useTotalCondonation";

export default function CardDataList({title,subtitle,data,link}){
    return (
        <div className="CardDataList">
            <div className="CardDataList__head">
                <h4>{title}</h4>
                <p>{subtitle}</p>
            </div>
            <div className="CardDataList__data">
                {
                    data.map((item,index)=>(
                        <div className="CardDataList__item" key={index}>
                            <div>
                                <p>ID</p>
                                <p>{item.id}</p>
                            </div>
                            <div>
                                <p>Crédito</p>
                                <p>{item.credito}</p>
                            </div>
                            {
                                (link.link==='/dashboard/reportes/pagos')
                                ?
                                    <div>
                                        <p>Monto</p>
                                        <p>$ {Number(item.valor_recibido)-Number(item.valor_devuelto)} USD</p>
                                    </div>
                                :
                                    (link.link==='/dashboard/reportes/creditos/condonacion')
                                    ?
                                        <div>
                                            <p>Monto</p>
                                            <p>$ {useTotalCondonation(item.prevDates,item.postDates)} USD</p>
                                        </div>
                                    : 
                                        <div>
                                            <p>Valor cuota</p>
                                            <p>$ {JSON.parse(item.postDates).monthlyFeeAmount} USD</p>
                                        </div>
                            }
                            
                            <div>
                                <p>Estado</p>
                                <p></p>
                            </div>
                            <button>Ver detalles</button>
                        </div>
                    ))
                }
                
            </div>
            {/* <NavLink to={link.link}>{link.text}</NavLink> */}
        </div>
    );
}