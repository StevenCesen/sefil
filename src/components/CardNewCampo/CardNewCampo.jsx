import { useEffect, useState } from "react";
import "./CardNewCampo.css";

export default function CardNewCampo({setCampo}){

    const [value,setValue]=useState();
    const [name,setName]=useState();

    useEffect(()=>{
        setValue('number');
        setName('');
    },[]);

    return (
        <div className="CardNewCampo">
            <p>Nuevo campo</p>

            <div className="CardNewCampo__intro">
                <label className="CardNewCampo--select">
                    Dato de entrada
                    <select
                        value={value}
                        onChange={(e)=>{
                            setValue(e.target.value);
                        }}
                    >
                        <option value={"number"}>Caja de número</option>
                        <option value={"textarea"}>Área de texto</option>
                        <option value={"date"}>Fecha</option>
                        <option value={"select"}>Menú de opciones</option>
                    </select>
                </label>

                <label className="CardNewCampo--select">
                    Nombre del campo
                    <input 
                        type="text" 
                        placeholder="Escribe aquí..."
                        onChange={(e)=>{
                            setName(e.target.value);
                        }}
                    />
                </label>
            </div>

            <div className="CardNewCampo__previsualizer">
                {
                    (value==="number")
                    ?
                        <label className="CardNewCampo--select">
                            {name}
                            <input 
                                type="number" 
                                placeholder="0.00"
                                step={0.01}
                            />
                        </label>

                    :   (value==="textarea")
                        ?

                            <label className="CardNewCampo--select">
                                {name}
                                <textarea
                                    placeholder="Escribe aquí..."
                                ></textarea>
                            </label>

                        :   (value==="date")
                            ?

                                <label className="CardNewCampo--select">
                                    {name}
                                    <input
                                        type="date"
                                        placeholder="Escribe aquí..."
                                    />
                                </label>

                            :   (value==="select")
                                ?
                                    <label className="CardNewCampo--select">
                                        {name}
                                        <select>
                                            <option>Opción 1</option>
                                            <option>Opción ...</option>
                                            <option>Opción n</option>
                                        </select>
                                    </label>
                                :   <></>
                    
                }
            </div>

            <div className="CardNewCampo__footer">
                <button
                    onClick={(e)=>{
                        setCampo({
                            type:value,
                            name:name
                        });
                    }}
                >Agregar a la plantilla</button>
            </div>
        </div>
    );
}