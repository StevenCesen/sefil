import { useEffect, useRef, useState } from "react";
import "./CardCreateCartera.css";

export default function CardCreateCartera(){

    const [viewContent,setView]=useState(false);

    const cartera_original=useRef();
    const cartera_actual=useRef();

    useEffect(()=>{
        setView(false);
    },[]);

    return (
        <div className="CardCreateCartera">
            <button className="CardCreateCartera__button" onClick={(e)=>{
                setView(!viewContent);

                if(!viewContent){
                    e.target.textContent="Cancelar";
                }else{
                    e.target.textContent="Nueva cartera";
                }
                
            }}>Nueva cartera</button>

            {
                (viewContent) ?
                    <div className="CardCreateCartera__inputDates">
                        <div>
                            <label>
                                Nombre de cartera:
                                <input type="text" placeholder="Escribe aquí.."/>
                            </label>
                        </div>

                        <div>
                            <label htmlFor="cartera_original">Cargar cartera original </label>
                            <input ref={cartera_original} type="file" id="cartera_original"/>
                        </div>

                        <div>
                            <label htmlFor="cartera_actual">Cargar cartera actual</label>
                            <input ref={cartera_actual} type="file" id="cartera_actual"/>
                        </div>
                        <button onClick={(e)=>{
                            console.log(cartera_original.current.files[0]);
                            console.log(cartera_actual.current.files[0]);
                        }}>Subir cartera</button>
                    </div>
                : <></>
            }
        </div>
    );
}