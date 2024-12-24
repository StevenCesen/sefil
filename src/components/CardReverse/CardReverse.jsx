import addNotification from "react-push-notification";
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

                                addNotification({
                                    title: 'Éxito',
                                    subtitle: 'Comprobante revertido correctamente',
                                    message: '',
                                    native: false,
                                    backgroundTop: '#009793',
                                    backgroundBottom: '#459d9a',
                                    colorTop: 'white',
                                    colorBottom: 'white',
                                    closeButton: 'Cerrar',
                                    duration:3000,
                                });

                            }else{

                                e.target.textContent="Revertir";
                                update();

                                addNotification({
                                    title: 'Tiempo expirado',
                                    subtitle: 'No se puede revertir este comprobante',
                                    message: 'Se ha sobrepasado el período de un día después de la emisión',
                                    native: false,
                                    backgroundTop: '#FF9619',
                                    backgroundBottom: '#fdb864',
                                    colorTop: 'white',
                                    colorBottom: 'white',
                                    closeButton: 'Cerrar',
                                    duration: 5000,
                                });
                            }
                        });
                }}
            >Revertir</button>
        </div>
    );
}