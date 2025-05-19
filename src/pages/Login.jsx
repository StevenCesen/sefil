import "./pages.css";
import { useRef, useState } from "react";
import useLogin from "../hooks/useLogin";
import { NavLink, redirect } from "react-router-dom";
import Eye from "../components/Eye/Eye";
import useSessions from "../hooks/useSessions";
import Loader from "../components/Loader/loader";

export default function Login(){

    const [user,setUser]=useState({
        ci:'',
        password:''
    });
    const [loading,setLoading]=useState();

    const response=useRef();
    const btn=useRef();
    const pass=useRef();

    function login(){
        const formdata=new URLSearchParams({
            "email":user.ci,
            "password":user.password
        });
        
        useLogin(formdata,response,btn,setLoading);
    }

    if (useSessions()) {
        location.href="./";
    }else{
        return (
            <div className="ContentLogin">
                <div className="Login">
                    <h1>Iniciar sesión</h1>
    
                    <form className="Login__form" autoComplete="off" onSubmit={e=>{
                        e.preventDefault();
                        setLoading(true);
                        login();
                    }}>
                        <label>
                            Email
                            <input
                                type="text"
                                name="ci"
                                required
                                placeholder="example@dominio.com"
                                value={user.ci}
                                onChange={(e)=>{
                                    setUser({
                                        ...user,
                                        ci:e.target.value
                                    })
                                }}
                            />
                        </label>
                        <label>
                            Contraseña
                            <input
                                
                                ref={pass}
                                type="password"
                                name="password"
                                placeholder="********"
                                value={user.password}
                                required
                                onChange={(e)=>{
                                    setUser({
                                        ...user,
                                        password:e.target.value
                                    })
                                }}
                            />
                            <Eye 
                                input={pass}
                            />
                        </label>
    
                        {/* <NavLink to="/recovery">¿Olvidaste tu contraseña?</NavLink> */}
    
                        <button ref={btn} type="submit" onClick={(e)=>{e.target.textContent='Cargando...'}}>Iniciar sesión</button>
                    </form>
                    <p ref={response}></p>
                </div>
                {
                    (loading)
                    ?
                        <Loader/>
                    :   <></>
                }
            </div>
        );
    } 
}