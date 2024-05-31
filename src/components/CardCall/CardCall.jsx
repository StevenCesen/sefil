import "./CardCall.css"

export default function CardCall({close,phone}){
    
    return (
        <div className="CardCall">
            <p>Disponible</p>

            <img src="./icons/logo.png"/>

            <div className="CardCall__count">
                <p>00:05</p>
            </div>

            <div className="CardCall__options">
                <button>NO CONTACTADO</button>
                <button>CONTACTADO</button>
                <button>SUSPENDIDO POR FALTA DE PAGO</button>
                <button>NÚMERO NO EXISTE</button>
                <button>REENVÍO A IVR</button>
            </div>

            <button className="CardCall__button CardCall__button--exit">
                <img src="./icons/phone.png"/>
            </button>

            <div className="CardCall__footer">
                <button 
                    onClick={()=>{
                        close()
                    }}
                    className="CardCall__button CardCall__button--save"
                >Guardar</button>
            </div>
        </div>
    );
}