import { useEffect, useRef, useState } from "react";
import "../CardEditJudicial/CardEditJudicial.css";
import addNotification from "react-push-notification";

export default function CardEditConvenio({restruct,update,close,ci,credito}){

    const [concept,setConcept]=useState();

    useEffect(()=>{
        setConcept("");
    },[]);

    return (
        <div className="CardEditJudicial">
            <p className="CardEditJudicial__header">Anulación de convenio</p>
            
            <h3>Motivo de anulación</h3>
            <span>Esta acción anula el convenio autorizado y se generarán gastos de cobranza en el crédito.</span>
            <textarea 
                placeholder="Escribe aquí el motivo de la anulación"
                value={concept}
                onChange={(e)=>{
                    setConcept(e.target.value);
                }}
            ></textarea>

            <div className="CardEditJudicial__footer">
                <button
                    onClick={(e)=>{

                        update(true);

                        e.target.textContent="Anulando convenio";
                        
                        let data={};

                        restruct.map(item=>{
                            if(item.status==='autorizado'){
                                data={
                                    id:item.id,
                                    status:'anulado',
                                    credito:item.credito,
                                    cartera:item.cartera,
                                    concept:concept,
                                    byUser:item.byUser,
                                    concept_mail:'anulación de convenio de pago',
                                    credito_mail:credito,
                                    ci_mail:ci
                                }
                            }
                        });
                        
                        fetch(`${import.meta.env.VITE_URL_BASE}/credit/estructurarnull/${data.id}`,{
                            method:'PUT',
                            body:new URLSearchParams(data),
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        })
                            .then((response) => response.json())  
                            .then((data) => {
                                e.target.textContent="Anulado";

                                update(false);
                                close(false);

                                addNotification({
                                    title: 'Convenio de pago anulado',
                                    subtitle: `Recargue la página.`,
                                    message: ``,
                                    native: false,
                                    backgroundTop: '#FF9619',
                                    backgroundBottom: '#fdb864',
                                    colorTop: 'white',
                                    colorBottom: 'black',
                                    closeButton: 'Cerrar',
                                    duration: 8000,
                                });
                            });

                    }}
                >Confirmar anulación</button>
            </div>
        </div>
    );
}