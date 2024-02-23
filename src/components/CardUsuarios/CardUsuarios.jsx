import { useRef } from "react";
import "./CardUsuarios.css";
import useMenu from "../../hooks/useMenu";

export default function CardUsuarios({id,name,email,rol,permission}){
    
    const menu=useRef();
    const permiss=useRef();

    return (
        <div className="CardUsuarios">
            <span>{id}</span>
            <span>{name}</span>
            <span>{email}</span>
            <span>{rol}</span>
            <span className="CardUsuarios__list" ref={permiss}>{
                permission.map((permiss,index)=>(
                    <label key={index}>
                        <input type="checkbox" checked/>
                        {permiss}
                    </label>
                ))    
            }</span>
            
            <button>
                <img src="./icons/options.png" onClick={(e)=>{useMenu(e.target,menu,'CardUsuarios__actions--active',null)}}/>
                <div ref={menu} className="CardUsuarios__actions">
                    <button>Editar datos</button>
                    <button>Editar permisos</button>
                    <button>Borrar</button>
                </div>
            </button>
        </div>
    );
}