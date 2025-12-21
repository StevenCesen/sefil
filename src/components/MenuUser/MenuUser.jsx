import { useEffect, useState } from "react";
import "./MenuUser.css";

export default function MenuUser(){
    const [user,setUser]=useState({});

    useEffect(()=>{
        setUser({
            shortName:localStorage.getItem('name').substring(0,1)+localStorage.getItem('name').split('_')[1].substring(0,1)
        });
    },[]);

    return (
        <div className="MenuUser">
            <button
                onClick={(e)=>{
                    location.hash='/dashboard/me';
                }}
            >{user.shortName}</button>
        </div>
    );
}