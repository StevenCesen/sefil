import { useState } from "react";
import "./CardAssignCampain.css";
import { useEffect } from "react";
import FilterRange from "../FilterRange/FilterRange";

export default function CardAssignCampain({id_campain,agents,data}){

    const [transfer,setTransfer]=useState(false);
    const [mode,setMode]=useState('manual');
    const [view_agencies,setView]=useState(false);

    useEffect(()=>{
        setMode('manual');
        setTransfer(false);
        setView(false);
    },[]);

    return (
        <div className="CardAssignCampain">
            <p className="CardAssignCampain__head">Asignación de campaña</p>
            
            <div className="CardAssignCampain__agents">
                <label>
                    Agente
                    <select>
                        <option value={"Cecibel Torres"}>Cecibel Torres</option>
                    </select>
                </label>
                {
                    (transfer)
                    ?   
                        <>
                            <p>a</p>
                            <label>
                                Agente
                                <select>
                                    <option value={"Cecibel Torres"}>Cecibel Torres</option>
                                </select>
                            </label>
                        </>
                    :   <></>
                }
            </div>
            
            <span>Forma de asignación</span>
            
            <div className="CardAssignCampain__radius">
                <label>
                    <input 
                        type="radio"
                        name="mode"
                        value={"manual"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
                                setTransfer(false);
                            }
                        }}
                    />
                    Manual
                </label>

                <label>
                    <input 
                        type="radio"
                        name="mode"
                        value={"transfer"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
                                setTransfer(true);
                            }
                        }}
                    />
                    Transferir carga
                </label>
            </div>

            <label 
                htmlFor="campain"
                className="CardAssignCampain__file">
                Cargar datos
                <input id="campain" type="file"/>
                <div>

                </div>
            </label>

            <span>Filtrado de datos</span>

            <div className="CardAssignCampain__radius">
                <label>
                    <input 
                        type="radio"
                        name="mode"
                        value={"manual"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
                                setTransfer(false);
                            }
                        }}
                    />
                    Coincidir
                </label>

                <label>
                    <input 
                        type="radio"
                        name="mode"
                        value={"transfer"}
                        onChange={(e)=>{
                            if(e.target.checked){
                                setMode(e.target.value);
                                setTransfer(true);
                            }
                        }}
                    />
                    No coincidir
                </label>
            </div>

            <div className="CardAssignCampain__filters">
                
                <div className="CardAssignCampain__ranges">
                    <FilterRange
                        title={"Días de mora"}
                    />
                    <FilterRange
                        title={"Cuotas pendientes"}
                    />
                    <FilterRange
                        title={"Monto total"}
                    />
                </div>
                
                <div className="CardAssignCampain__selects">
                    <label>
                        Estado
                        <select>
                            <option>Vencido</option>
                            <option>Vigente</option>
                            <option>Judicial</option>
                        </select>
                    </label>

                    <label>
                        Agencias
                        <div>
                            <button
                                onClick={(e)=>{
                                   setView(!view_agencies); 
                                }}
                            >--Seleccionar</button>
                            {
                                (view_agencies)
                                ?
                                    <div>
                                        <label>
                                            
                                            <input
                                                type="checkbox"
                                            />
                                            OFICINA LOJA CENTRO
                                        </label>

                                        <label>
                                            <input
                                                type="checkbox"
                                            />
                                            OFICINA LAS PITAS
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                            />
                                            GUALAQUIZA
                                        </label>
                                    </div>
                                :   <></>
                            }
                        </div>
                    </label>
                </div>

            </div>

            <div className="CardAssignCampain__footer">
                <button
                    onClick={(e)=>{
                        console.log(mode)
                    }}
                >Asignar</button>
            </div>
        </div>
    );
}