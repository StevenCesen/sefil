import { useEffect, useRef, useState } from "react";
import CardUsuarios from "../components/CardUsuarios/CardUsuarios";

export default function Usuarios(){

    const [users,setUsers]=useState([]);
    
    const content_users=useRef();
    
    const [new_user,setNew]=useState(true);

    const [data,setData]=useState({
        name:'',
        email:'',
        role:'',
        password:'12345',
        permission:[]
    });

    useEffect(()=>{
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/users`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
              .then((data) => {
                setUsers(data);
            });
        setNew(false);

    },[]);

    return (
        <div className="pageUsuarios" ref={content_users}>
            
            <div className="pageUsuarios__access">
                <button onClick={(e)=>{
                    setNew(!new_user);
                    if(new_user){
                        e.target.textContent='Agregar usuario';
                    }else{
                        e.target.textContent='Cancelar';
                    }
                }}>Agregar usuario</button>
            </div>
            
            <div className="pageUsuarios__head">
                <p>ID</p>
                <p>Nombre</p>
                <p>Correo electrónico</p>
                <p>Perfil</p>
                <p>Permisos</p>
                <p>Acciones</p>
            </div>
            
            {
                (new_user) &&
                    <div className="CardUsuarios">
                        <span>#</span>
                        <span><input type="text" placeholder="Escriba aquí..." value={data.name} onChange={(e)=>{setData({...data,name:e.target.value})}}/></span>
                        <span><input type="email" placeholder="name@domain.com" value={data.email} onChange={(e)=>{setData({...data,email:e.target.value})}}/></span>
                        <span>
                            <select value={data.role} onChange={(e)=>{
                                const permiss=[{
                                    permission:[]
                                }];

                                if(e.target.value==='super'){
                                    permiss[0].permission.push('DB:import');
                                    permiss[0].permission.push('DB:destroy');
                                    permiss[0].permission.push('DB:update');
                                    permiss[0].permission.push('DB:recovery');
                                    permiss[0].permission.push('Backup:show');
                                    permiss[0].permission.push('Backup:add');
                                    permiss[0].permission.push('Backup:update');
                                    
                                }else if(e.target.value==='gestor'){
                                    permiss[0].permission=[];
                                    permiss[0].permission.push('Consulta:all');
                                    permiss[0].permission.push('Gestion:all');
                                
                                }else if(e.target.value==='campo'){
                                    permiss[0].permission=[];
                                    permiss[0].permission.push('Consulta:all');
                                    permiss[0].permission.push('Gestion:all');

                                }else if(e.target.value==='administrador'){
                                    permiss[0].permission=[];
                                    permiss[0].permission.push('Consulta:all');
                                    permiss[0].permission.push('Cobranza:all');
                                    permiss[0].permission.push('Gestion:all');
                                    permiss[0].permission.push('Comprobantes:all');
                                    permiss[0].permission.push('Reportes:all');
                                    permiss[0].permission.push('User:minimize');
                                    
                                }else if(e.target.value==='cobranza'){
                                    permiss[0].permission=[];
                                    permiss[0].permission.push('Consulta:all');
                                    permiss[0].permission.push('Cobranza:all');
                                    permiss[0].permission.push('Comprobantes:all');

                                }else{
                                    permiss[0].permission=[];
                                    permiss[0].permission.push('Consulta:all');
                                    permiss[0].permission.push('Comprobantes:all');
                                }

                                setData({...data,role:e.target.value,permission:permiss})

                            }}>
                                {
                                    (localStorage.getItem('rol')==='super') &&
                                        <option value="super">Super usuario</option>
                                }
                                <option value="administrador">Administrador</option>
                                <option value="call">Gestor | Call Center</option>
                                <option value="campo">Gestor | Campo</option>
                                <option value="campo">Gestor | Judicial</option>
                                <option value="cobranza">Cobranza</option>
                                <option value="consulta">Consulta</option>
                            </select>
                        </span>
                        <span className="CardUsuarios__list">.</span>
                        
                        <button onClick={(e)=>{

                            const post_data=data;
                            post_data.permission=JSON.stringify(data.permission);
                            const new_data=new URLSearchParams(post_data);

                            e.target.textContent='Guardando...';

                            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/register`,{
                                method:'POST',
                                body:new_data,
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then((response) => response.json())  
                                  .then((data) => setUsers(data.data));
                            setNew(false);

                        }}>Guardar</button>
                    </div>
            }

            {
                users.map((user,index)=>(
                    <CardUsuarios
                        key={index}
                        id={user.id}
                        name={user.name}
                        email={user.email}
                        rol={user.role}
                        permission={JSON.parse(user.permission)[0].permission}
                    />
                ))
            }
            
        </div>
    );
}