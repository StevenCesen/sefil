import { NavLink } from "react-router-dom";
import "./CardExportPays.css"

export default function CardExportPays(){
    return (
        <div className="CardExportPays">
            <h4>Historial de pagos</h4>
            <p>Historial completo de pagos.</p>
            <NavLink to={"https://sefil.softsen.space/public/api/pays"}>Exportar EXCEL</NavLink>
        </div>
    );
}