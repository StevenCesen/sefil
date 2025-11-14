import "./NavigationFooter.css";

export default function NavigationFooter({page,from,to,total}){
    return (
        <p className="NavigationFooter">Mostrando la página {page} con registros del {from} al {to} de {total} registros.</p>
    );
}