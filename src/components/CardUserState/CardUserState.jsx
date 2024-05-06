import "./CardUserState.css";

export default function CardUserState({name,state,time,nro_calls,name_campain,total_do,detail_cobranza,mode}){

    return (
        <div className={`CardUserState ${(mode==='complete') ? "CardUserState__complete" : ""}`}>
            <p>{name}</p>

            <p 
                className={`
                    CardUserState__state
                    ${
                        (state==='EN LLAMADA') 
                        ?  "CardUserState__state--active"
                        : (state==='DISPONIBLE')
                            ? "CardUserState__state--connect"
                            : (state==='EN PAUSA')
                                ? "CardUserState__state--pause"
                                : (state==='DESCONECTADO') 
                                    ? "CardUserState__state--disconnect"
                                    : ""
                    
                    }
                `}
            >{state}</p>

            <p>{time}</p>
            <p>{nro_calls}</p>
            <p>{name_campain}</p>
            <p>{total_do}</p>
            {
                (mode==='complete') 
                ?
                    <>
                        <p>Modo completo</p>
                    </>
                : 
                    <></>
            }
        </div>
    );

}