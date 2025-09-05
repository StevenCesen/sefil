import { NavLink } from "react-router-dom";
import "./pages.css";
import { useEffect, useState } from "react";
import Loader from "../components/Loader/loader";
import SelectAgency from "../components/Campains/SelectAgency/SelectAgency";

export default function Directions(){
    const [filter,setFilter]=useState({
        cartera:'',
        agencia:'',
        user_id:'',
        name:''
    });

    const [users,setUsers]=useState();
    const [loading,setLoading]=useState();

    const handleSelectOption=(value)=>{
        setFilter({
            ...filter,
            agencia:value
        });
    }

    useEffect(()=>{
        setLoading(true);
        fetch(`${import.meta.env.VITE_URL_BASE}/users?agente=campo`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
                .then((data) => {
                    setLoading(false);
                    setUsers(data);
            });
    },[]);

    if(!users) return <Loader/>

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
                    
            <div class="Directions__search">
                <label>
                    Agente
                    <select
                        onChange={(e)=>{
                            setFilter({
                                ...filter,
                                user_id:e.target.value.split('/')[0],
                                name:e.target.value.split('/')[1]
                            })
                        }}
                    >
                        <option>-- Seleccionar --</option>
                        {
                            users.map(user=>(
                                <option value={`${user.id}/${user.name}`}>{user.name}</option>
                            ))
                        }
                    </select>
                </label>
                <label>
                    Cartera
                    <select
                        value={filter.cartera}
                        onChange={(e)=>{
                            setFilter({
                                ...filter,
                                cartera:e.target.value
                            })
                        }}
                    >
                        <option value={"SEFIL_1"}>SEFIL 1</option>
                        <option value={"SEFIL_2"}>SEFIL 2</option>
                        <option value={"syncs"}>FACES</option>
                    </select>
                </label>
                
                <SelectAgency setOptions={handleSelectOption}/>
                <a 
                    href={`${import.meta.env.VITE_URL_BASE}/GenDirecciones?user_id=${filter.user_id}&agente=${filter.name}&cartera=${filter.cartera}&agencias=${JSON.stringify(filter.agencia)}`} 
                    target="_blank"
                >Descargar direcciones</a>
                <a 
                    href={`${import.meta.env.VITE_URL_BASE}/GenAsignacion?user_id=${filter.user_id}&agente=${filter.name}&cartera=${filter.cartera}`} 
                    target="_blank"
                >Descargar asignación</a>
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