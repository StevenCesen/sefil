import { useContext } from "react";
import "./CardNotifierSimple.css";
import { NotifierContext } from "../../contexts/notifierContext";
import { NavLink } from "react-router-dom";

export default function CardNotifierSimple({message,cartera,credito,byUser,id}){
    const dataContext=useContext(NotifierContext);

    return (
        <div className="CardNotifierSimple">
            <div className="CardNotifierSimple__contentText">
                <p>{message}</p>
                <span>Comprobante #: {id}</span>
                <span>Generado por {byUser}</span>
                
                <NavLink to={`/dashboard/recaudacion/view/${cartera}?id=${credito}`} onClick={()=>{localStorage.setItem('hash','#/dashboard/consulta')}}> Ir al crédito</NavLink>
                
            </div>
            <div>
                <button 
                    className="CardNotifierSimple__button CardNotifierModify__button--success"
                    onClick={(e)=>{
                        e.target.textContent='Autorizando...';
                        fetch(`${import.meta.env.VITE_URL_BASE}/vouchers/reprint/${id}`,{
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                e.target.textContent='Autorizado';
                                dataContext.removePush(id);
                            });
                    }}
                >Autorizar</button>
                <button 
                    className="CardNotifierSimple__button CardNotifierModify__button--failed"
                    onClick={(e)=>{
                        dataContext.removePush(id);
                    }}
                >Negar</button>
            </div>
        </div>
    );
}