import { NavLink } from "react-router-dom";
import "./CardCredit.css";

export default function CardCredit({id,total_credito,nro_cuotas,valor_cuota,cuotas_vencidas,cuotas_pagadas,total_pagar,estado,fecha_pago,action}){
    return (
        <div className={`CardCredit ${(estado==="vencido") ? "CardCredit__alert" : (estado==="inactivo") && "CardCredit__inactive"}`}>
            <div>
                <label>Contrato</label>
                <NavLink title="Abrir crédito" to={`/dashboard/cobranza/${id}`}>{id}</NavLink>
            </div>
            <div>
                <label>Total crédito</label>
                <p>$ {total_credito} USD</p>
            </div>
            <div>
                <label>Fecha de pago</label>
                <p>{fecha_pago}</p>
            </div>
            <div>
                <label>Nro. Cuotas</label>
                <p>{nro_cuotas}</p>
            </div>
            <div>
                <label>Cuotas pagadas</label>
                <p>{cuotas_pagadas}</p>
            </div>
            <div>
                <label>Cuotas vencidas</label>
                <p>{cuotas_vencidas}</p>
            </div>
            <div>
                <label>Valor cuota</label>
                <p>$ {valor_cuota} USD</p>
            </div>
            <div>
                <label>Pendiente</label>
                <p>$ {total_pagar} USD</p>
            </div>
            {
                (estado!=="inactivo") && (action!=="consulta") ?
                <>
                    <div>
                        <label>Pago total</label>
                        <input type="radio" name="pago"/>
                    </div>
                    <div>
                        <label>Condonar</label>
                        <input type="radio" name="pago"/>
                    </div>
                    <div>
                        <label>Reestructurar</label>
                        <input type="radio" name="pago"/>
                    </div>
                </>
                : <></>
            }
            
        </div>
    );
}