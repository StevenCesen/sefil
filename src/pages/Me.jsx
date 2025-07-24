import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import Eye from "../components/Eye/Eye";
import Push from "../components/Push/Push";

export default function Me(){
    const [password,setPassword]=useState('');
    const pass=useRef();

    const mayus=useRef();
    const especial=useRef();
    const length=useRef();
    const number=useRef();
    const [accept,setAccept]=useState();
    const [code,setCode]=useState();

    const generateUUID=()=>{
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        return uuid;
    }

    useEffect(()=>{
        setAccept(false);
        setCode('');

        Push({
            title:'Actualización de contraseña',
            message:`Por tu seguridad, deberás actualizar la contraseña cada mes.`,
            timeout:5000,
            type:300
        });

        setPassword('');

    },[]);

    return (
        <div className="pageConsulta">
            <div className="DetailCredit__head">
                <NavLink
                    to="" 
                    onClick={(e)=>{
                        e.preventDefault();
                        history.go(-1) 
                    }}
                >Regresar</NavLink>
            </div>
            
            <div className="pageConsulta__userDates">
                <h1>{localStorage.getItem('name').substring(0,1)+localStorage.getItem('name').split(' ')[1].substring(0,1)}</h1>
                <div>
                    <p>{localStorage.getItem('name')}</p>
                    <div>
                        <h2>Autenticación</h2>
                        <label>
                            Código de seguridad
                            <input
                                type="text"
                                value={code}
                                autoComplete="nope"
                                onChange={(e)=>{
                                    setCode(e.target.value);
                                }}
                            />
                            <button
                                onClick={(e)=>{
                                    e.target.textContent="Enviando...";

                                    fetch(`${import.meta.env.VITE_URL_BASE}/sendcode?id=${localStorage.getItem('temp_uS')}&code=${generateUUID()}`,{
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            e.target.textContent="Código enviado";
                                        });
                                }}
                            >Obtener código</button>
                        </label>
                        <label>
                            Contraseña
                            <input 
                                ref={pass}
                                type="password" 
                                placeholder="*******" 
                                value={password}
                                preventDefault={""}
                                autoComplete="nope"
                                onChange={(e)=>{
                                    if(e.target.value!==''){
                                        if(e.target.value.match(/[A-Z]+/g)!==null){
                                            setAccept(true);
                                            mayus.current.classList.add('pageConsulta__userDates--acceptValue');
                                        }else{
                                            setAccept(false);
                                            mayus.current.classList.remove('pageConsulta__userDates--acceptValue');
                                        }

                                        if(e.target.value.match(/[0-9]+/g)!==null){
                                            setAccept(true);
                                            number.current.classList.add('pageConsulta__userDates--acceptValue');
                                        }else{
                                            setAccept(false);
                                            number.current.classList.remove('pageConsulta__userDates--acceptValue');
                                        }

                                        if(e.target.value.match(/[@^ $#&Ññ]+/g)!==null){
                                            setAccept(true);
                                            especial.current.classList.add('pageConsulta__userDates--acceptValue');
                                        }else{
                                            setAccept(false);
                                            especial.current.classList.remove('pageConsulta__userDates--acceptValue');
                                        }

                                        if(e.target.value.length>=8){
                                            setAccept(true);
                                            length.current.classList.add('pageConsulta__userDates--acceptValue');
                                        }else{
                                            setAccept(false);
                                            length.current.classList.remove('pageConsulta__userDates--acceptValue');
                                        }

                                        console.log(accept)

                                        setPassword(e.target.value);
                                    }else{
                                        setPassword('');
                                    }
                                }}
                            />
                            <Eye
                                input={pass}
                            />
                        </label>

                        <div>
                            <p ref={length}>Debe tener longitud de 8 o más caracteres</p>
                            <p ref={mayus}>Debe contener mayúsculas</p>
                            <p ref={number}>Debe contener números</p>
                            <p ref={especial}>Debe contener almenos un caracter especial</p>
                        </div>

                        <button
                            onClick={(e)=>{
                                e.target.textContent='Actualizando...';
                                
                                if(accept & code!==""){
                                    fetch(`${import.meta.env.VITE_URL_BASE}/users/password/${localStorage.getItem('temp_uS')}`,{
                                        method:'PUT',
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        },
                                        body:new URLSearchParams({password:password,code:code})
                                    })
                                        .then((response) => response.json())  
                                        .then((data) => {
                                            if(data.state===200){
                                                e.target.textContent='Actualizada';
                                                localStorage.setItem('change_ps',false);
                                            }else{
                                                e.target.textContent='Actualizar';

                                                Push({
                                                    title:'ERR: Contraseña',
                                                    message:`Ingresa una nueva contraseña.`,
                                                    timeout:5000,
                                                    type:400
                                                });

                                            }
                                        });
                                }else if(code===""){
                                    e.target.textContent='Actualizar';
                                    Push({
                                        title:'ERR: Contraseña',
                                        message:`Revise su correo electrónico e introduzca el código, o comuníquese con administración.`,
                                        timeout:5000,
                                        type:400
                                    });
                                
                                }else{
                                    e.target.textContent='Actualizar';

                                    Push({
                                        title:'ERR: Contraseña',
                                        message:`Por favor, revisa que la contraseña cumpla con el formato.`,
                                        timeout:5000,
                                        type:400
                                    });

                                }
                                
                            }}
                        >Actualizar</button>
                    </div>
                </div>
            </div>

        </div>
    );
}