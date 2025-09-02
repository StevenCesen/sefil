import useLogout from "../../hooks/useLogout.js";
import useSessions from "../../hooks/useSessions.js";
import "./Header.css";
import MenuUser from "../MenuUser/MenuUser.jsx";
import MenuNotifier from "../MenuNotifier/MenuNotifier.jsx";
import CardSelectState from "../CardSelectState/CardSelectState.jsx";
import logo6 from "../../assets/icons/logo.png";

export default function Header(){
    return(
        <header className="header">
            <img src={logo6}/>
            {
                (useSessions()) && 
                    <>
                        {
                            (localStorage.getItem('rol')==='gestor' | localStorage.getItem('rol')==='legal' | localStorage.getItem('rol')==='gestor' | localStorage.getItem('rol')==='administrador' | localStorage.getItem('rol')==='call' | localStorage.getItem('rol')==='campo') 
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