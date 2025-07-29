import sendpush from "../../helpers/sendpush";
import "./CardReverse.css";

export default function CardReverse({id,name,fecha,update}){
    return (
        <div className="CardReverse">
            <h3>Revertir comprobante de pago</h3>
            <p>Esta opción esta disponible durante el día del pago.</p>
            <h4>Detalle:</h4>
            <label>Comprobante: <strong style={{fontWeight:'bold'}}>{id}</strong></label>
            <label>Fecha: {fecha}</label>
    
            <button
                onClick={(e)=>{
                    e.target.textContent="Procesando...";
                    fetch(`${import.meta.env.VITE_URL_BASE}/credit/reverse/${id}`,{
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then((response) => response.json())  
                        .then(async (data) => {
                            if(data.status===200){
                                
                                e.target.textContent="Revertido";

                                update();
                                
                                sendpush({
                                    title:'Éxito.',
                                    message:'Comprobante revertido.',
                                    type:'Push--sucessful',
                                    timeout:3000
                                });

                            }else{

                                e.target.textContent="Revertir";
                                update();
                                sendpush({
                                    title:'ERR: Tiempo expirado',
                                    message:'Se ha sobrepasado el período de un día después de la emisión.',
                                    type:'Push--danger',
                                    timeout:3000
                                });
                            }
                        });
                }}
            >Revertir</button>
        </div>
    );
}