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

                                Push({
                                    title:'Éxito',
                                    message:`Comprobante revertido.`,
                                    timeout:3000,
                                    type:200
                                });

                            }else{

                                e.target.textContent="Revertir";
                                update();

                                Push({
                                    title:'ERR: Tiempo expirado',
                                    message:`Se ha sobrepasado el período de un día después de la emisión.`,
                                    timeout:5000,
                                    type:400
                                });
                            }
                        });
                }}
            >Revertir</button>
        </div>
    );
}