import { NavLink, useLocation, useParams } from "react-router-dom";
import "./pages.css";
import { useEffect, useRef, useState } from "react";
import Eye from "../components/Eye/Eye";

export default function Me(){
    const param = useParams();
    const cartera=new URLSearchParams(useLocation().search);

    const [password,setPassword]=useState('');
    const pass=useRef();

    useEffect(()=>{
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
                                console.log(password)
                                fetch(`https://sefil.softsen.space/public/api/users/password/${localStorage.getItem('temp_uS')}`,{
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
                                            e.target.textContent='Error, vuelve a intentar';
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