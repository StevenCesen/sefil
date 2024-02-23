import { NavLink, useParams } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import CardCreateCartera from "../components/CardCreateCartera/CardCreateCartera";
import CardListCarteras from "../components/CardListCarteras/CardListCarteras";
import CardUpdateCartera from "../components/CardUpdateCartera/CardUpdateCartera";

export default function Setting(){
    const param = useParams();
    const load=useRef();
    const load2=useRef();
    const input=useRef();
    const input2=useRef();
    const document=useRef();
    const document2=useRef();

    const [button,setButton]=useState(true);
    const [button2,setButton2]=useState(true);
    const [update,setUpdate]=useState(false);

    useEffect(()=>{
        setButton(false)
        setButton2(false)
    },[]);

    return (
        <div className="pageConsulta">

            <div className="DetailCredit__head">
                <NavLink to="" onClick={()=>history.back()}>Regresar</NavLink>
            </div>

            {
                (param.ci!==null | param.ci!=="") 
                ?
                    (param.ci==='importdb')
                    ?
                        
                        <>
                            <CardCreateCartera/>
                            <div className="DetailCredit__sections">
                                <div>
                                    <p>Carteras cargadas</p>
                                    <label>Formato de archivo .xlsx (EXCEL) </label>
                                </div>
                            </div>

                            <div className="CardListCarteras__head">
                                <label>Cartera</label>
                                <label>Subida</label>
                                <label>Última actualización</label>
                                <label>Versiones</label>
                                <label>Acciones</label>
                            </div>

                            <CardListCarteras
                                name={"SEFIL 1"}
                                fecha_upload={"2024/02/22"}
                                last_update={"2024/05/22"}
                                versions={['SEFIL 1 - 2024/02/22','SEFIL 1 - 2024/03/22','SEFIL 1 - 2024/04/22','SEFIL 1 - 2024/05/22']}
                            />
                            <CardListCarteras
                                name={"FACES DICIEMBRE"}
                                fecha_upload={"2023/12/22"}
                                last_update={"2024/04/22"}
                                versions={['FACES DICIEMBRE - 2023/12/22','FACES DICIEMBRE - 2024/01/22','FACES DICIEMBRE - 2024/02/22','FACES DICIEMBRE - 2024/03/22','FACES DICIEMBRE - 2024/04/22']}
                            />
                        </>
                    :
                        (param.ci==='exportdb')
                        ?
                            <h1>Exportar bases de datos</h1>
                        :<h1>Copias de seguridad</h1>
                : <CardCreateCartera/>
            }

            {
                // <CardUpdateCartera/>
            }
            
            {/* <div className="DetailCredit__sections">
                <div>
                    <p>Importación de datos</p>
                    <label>Formato de archivo .xlsx (EXCEL) </label>
                </div>

                <div className="DetailCredit__functions">
                    <div className="PageSettingBD__input">
                        <label>Importar cartera de créditos</label>
                        <div className="PageSettingBD__tools">
                            <div>
                                <p>Seleccione un archivo</p>
                                <label htmlFor="file" ref={input}>
                                    Buscar en mi computador
                                </label>
                            </div>

                            <input ref={document} onChange={(e)=>{
                                input.current.textContent='Documento cargado, click para cambiar'
                                
                                const file=e.target.files[0];
                                
                                const template=`
                                    <div>
                                        <p>Nombre</p>
                                        <label>${file.name}</label>
                                    </div>
                                    <div>
                                        <p>Tamaño</p>
                                        <label>${file.size} Bytes</label>
                                    </div>
                                    <div>
                                        <p>Formato</p>
                                        <label>${file.type}</label>
                                    </div>
                                `;
                                load.current.innerHTML='';
                                load.current.insertAdjacentHTML('beforeend',template);
                                setButton(true);
                            }} id="file" type="file"/>
                            <span ref={load}>
                                
                            </span>
                            {
                                (button) &&
                                    <button onClick={(e)=>{
                                        e.target.textContent='Cargando...';
                                    

                                        const new_data=new FormData();
                                        new_data.append('file',document.current.files[0]);

                                        fetch("https://sefil.softsen.space/public/api/import",{
                                            method:'POST',
                                            body:new_data,
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                if(data.message==='Importación exitosa'){
                                                    e.target.textContent='Importación correcta';
                                                }
                                            });

                                        
                                    }}>Iniciar importación de cartera</button>
                            }
                        </div>
                    </div>

                    <div className="PageSettingBD__input">

                        <label>Importar pagos</label>

                        <div className="PageSettingBD__tools">
                            <div>
                                <p>Seleccione un archivo</p>
                                <label htmlFor="file2" ref={input2}>
                                    Buscar en mi computador
                                </label>
                            </div>

                            <input ref={document2} onChange={(e)=>{
                                input2.current.textContent='Documento cargado, click para cambiar'
                                
                                const file=e.target.files[0];
                                
                                const template=`
                                    <div>
                                        <p>Nombre</p>
                                        <label>${file.name}</label>
                                    </div>
                                    <div>
                                        <p>Tamaño</p>
                                        <label>${file.size} Bytes</label>
                                    </div>
                                    <div>
                                        <p>Formato</p>
                                        <label>${file.type}</label>
                                    </div>
                                `;
                                load2.current.innerHTML='';
                                load2.current.insertAdjacentHTML('beforeend',template);
                                setButton2(true);
                            }} id="file2" type="file"/>

                            <span ref={load2}>
                                
                            </span>

                            {
                                (button2) &&
                                    <button onClick={(e)=>{
                                        e.target.textContent='Cargando...';
                    
                                        const new_data=new FormData();
                                        new_data.append('file',document2.current.files[0]);

                                        fetch("https://sefil.softsen.space/public/api/import",{
                                            method:'POST',
                                            body:new_data,
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }
                                        })
                                            .then((response) => response.json())  
                                            .then((data) => {
                                                if(data.message==='Importación exitosa'){
                                                    e.target.textContent='Importación correcta';
                                                }
                                            });

                                        
                                    }}>Iniciar importación</button>
                            }
                        </div>

                    </div>
                </div>
            </div> */}

                
                {/* <div className="DetailCredit__btn">
                    <label>Exportar cartera de créditos</label>
                    <NavLink to="https://sefil.softsen.space/public/api/exportar">Cartera {new Date().toLocaleDateString()}</NavLink>
                </div> */}

                {/* <div className="DetailCredit__btn">
                    <label>Exportar reporte ejecutivo</label>
                    <NavLink to="https://sefil.softsen.space/public/api/exportar">Reporte {new Date().toLocaleDateString()}</NavLink>
                </div> */}
        </div>
    );
}