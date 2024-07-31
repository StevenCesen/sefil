import "./CardUserState.css";

export default function CardUserState({name,state,time,mode,data}){

    return (
        <div className={`CardUserState ${(mode==='complete') ? "CardUserState__complete" : ""}`}>
            <p>{name}</p>

            <p 
                className={`
                    CardUserState__state
                    ${
                        (state==='FUERA DE LÍNEA') 
                        ?  "CardUserState__state--disconnect"
                        : (state==='CONECTADO')
                            ? "CardUserState__state--connect"
                            : (state==='EN PAUSA'  | state==='EN RECESO' | state==='EN ALMUERZO' | state==='EN REUNIÓN')
                                ? "CardUserState__state--pause"
                                : "CardUserState__state--active"
                    
                    }
                `}
            >{state}</p>

            <p>{time}</p>
            <p>{"SEFIL_2"}</p>
            {
                (mode==='complete') 
                ?
                    <>
                        <p>{data.nro_credits}</p>
                        <p>{data.nro_gestions}</p>
                        <p>{data.nro_calls}</p>
                        <p>{data.nro_efec}</p>
                        <p>{data.nro_no_efec}</p>
                    </>
                : 
                    <></>
            }
        </div>
    );

}