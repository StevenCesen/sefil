import useLogout from "../../hooks/useLogout.js";
import useSessions from "../../hooks/useSessions.js";
import "./Header.css";
import MenuUser from "../MenuUser/MenuUser.jsx";
import MenuNotifier from "../MenuNotifier/MenuNotifier.jsx";
import CardSelectState from "../CardSelectState/CardSelectState.jsx";

export default function Header(){
    return(
        <header className="header">
            <img src="./icons/logo.png"/>
            {
                (useSessions()) && 
                    <>
                        {
                            (localStorage.getItem('rol')==='gestor' | localStorage.getItem('rol')==='legal' | localStorage.getItem('rol')==='gestor' | localStorage.getItem('rol')==='call' | localStorage.getItem('rol')==='campo') 
                            ?
                                <CardSelectState
                                    mode={"select"}
                                    current_option={"CONECTADO"}
                                />
                                
                            :   <div></div>
                        }
                        {
                            (localStorage.getItem('rol')==='administrador') &&
                                <MenuNotifier/>
                        }
                        <MenuUser/>
                        <button onClick={e=>{useLogout(e)}}>Cerrar sesión</button>
                    </>
            }
            
        </header>
    );
}