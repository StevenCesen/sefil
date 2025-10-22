import CardQuote from "./CardQuote";
import "./CardStructure.css";

export default function CardStructure({restruct,is_active}){
    return (
        <div className="CardStructure">
            <span className="CardStructure__subtitle">{ (restruct.status==='autorizado') ? 'CONVENIO VIGENTE' : `CONVENIO ${restruct.status}` }</span>
            <span className="CardStructure__subtitle">Realizado: {restruct.fecha}</span>
            <div className="CardStructure__detail">
                <div className="CardStructure__detailHead">
                    <p>Nro.</p>
                    <p>Valor</p>
                    <p>Fecha pago</p>
                    <p>Estado</p>
                </div>
                {
                    JSON.parse(restruct.detail).map((quote,n)=>(
                        <CardQuote quote={ quote } n={ n } key={ n }/>
                    ))
                }
            </div>
        </div>
    );
}