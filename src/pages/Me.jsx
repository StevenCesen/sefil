import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import Eye from "../components/Eye/Eye";
import addNotification from "react-push-notification";

export default function Me(){
    const param = useParams();
    const cartera=new URLSearchParams(useLocation().search);

    const [password,setPassword]=useState('');
    const pass=useRef();

    useEffect(()=>{
        addNotification({
            title: 'Actualización de contraseña',
            subtitle: 'Por tu seguridad, deberás actualizar la contraseña cada mes',
            message: '',
            native: false,
            backgroundTop: '#009793',
            backgroundBottom: '#459d9a',
            colorTop: 'white',
            colorBottom: 'white',
            closeButton: 'Cerrar',
            duration:4000,
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
                            Contraseña
                            <input 
                                ref={pass}
                                type="password" 
                                placeholder="*******" 
                                value={password}
                                onChange={(e)=>{
                                    if(e.target.value!==''){
                                        setPassword(e.target.value);
                                    }
                                }}
                            />
                            <Eye
                                input={pass}
                            />
                        </label>
                        <button
                            onClick={(e)=>{
                                e.target.textContent='Actualizando...';
                            
                                fetch(`${import.meta.env.VITE_URL_BASE}/public/api/users/password/${localStorage.getItem('temp_uS')}`,{
                                    method:'PUT',
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                    },
                                    body:new URLSearchParams({password:password})
                                })
                                    .then((response) => response.json())  
                                    .then((data) => {
                                        if(data.state===200){
                                            e.target.textContent='Actualizada';
                                        }else{
                                            e.target.textContent='Actualizar';
                                            addNotification({
                                                title: 'Error',
                                                subtitle: data.message,
                                                message: 'Ingresa una nueva contraseña',
                                                native: false,
                                                backgroundTop: '#FF9619',
                                                backgroundBottom: '#fdb864',
                                                colorTop: 'white',
                                                colorBottom: 'white',
                                                closeButton: 'Cerrar',
                                                duration: 3000,
                                            });
                                        }
                                    });
                            }}
                        >Actualizar</button>
                    </div>
                </div>
            </div>

        </div>
    );
}