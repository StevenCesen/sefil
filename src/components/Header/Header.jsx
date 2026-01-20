import useLogout from "../../hooks/useLogout.js";
import useSessions from "../../hooks/useSessions.js";
import "./Header.css";
import MenuUser from "../MenuUser/MenuUser.jsx";
import MenuNotifier from "../MenuNotifier/MenuNotifier.jsx";
import CardSelectState from "../CardSelectState/CardSelectState.jsx";

export default function Header(){

    const handleLogout = (e) => {
        useLogout(e);
    };

    const isAdminOrSupervisor = localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'supervisor';

    return(
        <header className={`header ${isAdminOrSupervisor ? 'header--admin' : 'header--agent'}`}>
            <img src={'./icons/logo.png'}/>
            {
                (useSessions()) &&
                    <>
                        <CardSelectState
                            mode={"select"}
                            current_option={"CONECTADO"}
                        />
                        {isAdminOrSupervisor && <MenuNotifier/>}
                        <MenuUser/>
                        <button onClick={handleLogout}>Cerrar sesión</button>
                    </>
            }

        </header>
    );
}