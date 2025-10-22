import useFormatterNumber from "../../hooks/useFormatterNumber";
import { useViewStruct } from "../../stores/useViewStruct";
import "./CardViewConvenio.css";

export default function CardViewConvenio(){
    const store_structure=useViewStruct();

    if(!store_structure.isViewOn) return <></>
    
    const restruct = store_structure.struct;
    
    return (
        <div className="DetailCredit__activity">
            <div>
                <span style={{fontSize:"18px"}}>Convenio realizado: {restruct.fecha}</span>
                    <div style={{marginTop:"10px",borderTop:"1px solid grey",borderLeft:"1px solid grey",borderRight:"1px solid grey"}}>
                    <div style={{display:"grid",textAlign:"center",justifyContent:"center",alignItems:"center",gridTemplateColumns:"10% 30% 30% 30%",height:"30px",borderBottom:"1px solid grey"}}>
                        <p style={{fontSize:"14px",fontWeight:"bold"}}>Nro.</p>
                        <p style={{fontSize:"14px",fontWeight:"bold"}}>Valor</p>
                        <p style={{fontSize:"14px",fontWeight:"bold"}}>Fecha pago</p>
                        <p style={{fontSize:"14px",fontWeight:"bold"}}>Estado</p>
                    </div>
                    {
                        JSON.parse(restruct.detail).map((cuota,n)=>(
                            <div style={{display:"grid",justifyContent:"center",alignItems:"center",gridTemplateColumns:"10% 30% 30% 30%",height:"40px",textAlign:"center",borderBottom:"1px solid grey"}}>
                                <p>{cuota.cuota}</p>
                                <p>{useFormatterNumber({value:cuota.valor,currency:'USD'})}</p>
                                <p>{('fecha_pago' in cuota) ? cuota.fecha_pago : ""}</p>
                                {
                                    (cuota.estado==='PENDIENTE')
                                    ?
                                        <>PENDIENTE</>
                                    :   <p style={{fontSize:"14px"}}>{cuota.estado}</p>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
            <button onClick={()=>{store_structure.viewOn(false)}}>Volver</button>
        </div>
    );
}