import useLogout from "../../hooks/useLogout.js";
import useSessions from "../../hooks/useSessions.js";
import "./Header.css";
import MenuUser from "../MenuUser/MenuUser.jsx";
import MenuNotifier from "../MenuNotifier/MenuNotifier.jsx";

export default function Header(){
    return(
        <header className="header">
            <img src="./icons/logo.png"/>
            {
                (useSessions()) && 
                    <>
                        <div></div>
                        {
                            (localStorage.getItem('rol')==='administrador') &&
                                <MenuNotifier/>
                        }
                        <MenuUser/>
                        <button onClick={e=>{useLogout()}}>Cerrar sesión</button>
                    </>
            }
            
        </header>
    );
}