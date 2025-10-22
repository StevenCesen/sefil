import "./NavigationFooter.css";

export default function NavigationFooter({from,to,total}){
    return (
        <p className="NavigationFooter">Mostrando registros del {from} al {to} de {total} registros.</p>
    );
}