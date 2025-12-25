import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MenuUser.css";

export default function MenuUser(){
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        const name = localStorage.getItem('name');
        if (name) {
            const nameParts = name.split(' ');
            const firstInitial = name.substring(0, 1);
            const secondInitial = nameParts.length > 1 ? nameParts[1].substring(0, 1) : '';

            setUser({
                shortName: firstInitial + secondInitial
            });
        }
    }, []);

    const handleNavigateToProfile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/me');
    };

    return (
        <div className="MenuUser">
            <button
                onClick={handleNavigateToProfile}
                title="Mi perfil"
                aria-label="Ir a mi perfil"
                type="button"
            >
                {user.shortName}
            </button>
        </div>
    );
}