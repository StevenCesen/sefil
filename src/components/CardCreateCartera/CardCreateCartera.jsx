import { useEffect, useRef, useState } from "react";
import "./CardCreateCartera.css";

export default function CardCreateCartera(){

    const [viewContent,setView]=useState(false);

    const cartera_original=useRef();
    const cartera_actual=useRef();
    const cartera_name=useRef();

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
                                <input ref={cartera_name} type="text" placeholder="Escribe aquí.."/>
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

                            const data_import=new FormData();
                            data_import.append('name',cartera_name.current.value);
                            data_import.append('file',cartera_actual.current.files[0]);
                            data_import.append('file_original',cartera_original.current.files[0]);
                            e.target.textContent='Importando cartera, espere...';

                            fetch("https://sefil.softsen.space/public/api/cartera/create",{
                                method:'POST',
                                body:data_import,
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    console.log(data)
                                    e.target.textContent='Importación correcta';
                                });


                        }}>Subir cartera</button>

                    </div>
                : <></>
            }
        </div>
    );
}