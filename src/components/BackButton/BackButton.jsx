import { useNavigate } from "react-router-dom";
import "./BackButton.css";

export default function BackButton({ children }) {
    const navigate = useNavigate();

    return (
        <div className={`BackButton__container ${children ? 'BackButton__container--flex' : ''}`}>
            <button
                className="BackButton"
                onClick={() => navigate(-1)}
            >
                &lt; &lt; Regresar
            </button>
            {children}
        </div>
    );
}
