export default function FormManagement(){
    return(
        <div className="FormManagement">

            <div className="FormManagement">
                <h4>Gestión</h4>
                <div className="FormManagement__actions">
                    <button>Seguir</button>
                    
                </div>
            </div>



            <div className="Ggestion__regist">
                <div className="Ggestion__principal">
                    <div>
                        <div className="Ggestion__principalHead">
                            <div>
                                <h3 className="Ggestion__title">Gestión ({message_state})</h3>
                                <p>Quedan ({total_tray})</p>
                            </div>
                            
                            {/* En este botón se hace verificación de estados de llamadas para guardar en bandeja de "EN PROCESO" */}

                            <button
                                className="Ggestion__buttons--blank"
                                onClick={(e)=>{

                                    let count=0;
                                    
                                    form.current.reset();
                                
                                    if(incall){
                                        sendpush({
                                            title:'ERR: Llamada en progreso.',
                                            message:'Por favor, termine la llamada para marcar a otro número.',
                                            type:'Push--danger',
                                            timeout:3000
                                        });

                                        e.target.textContent="Seguir";

                                    }else if(states.length>0){
                                        states.map((state)=>{
                                            if(state==='CONTACTADO'){
                                                count++;
                                            }
                                        });
    
                                        if(count===0){
                                            const data={
                                                id_campain:id_campain.split('/')[0],
                                                id_credit:data_gestion.id_credit,
                                                cartera:data_gestion.cartera
                                            };

                                            e.target.textContent="Espere...";

                                            if(data.id_campain!==undefined & data.id_credit!==undefined & data.cartera!==undefined){
                                                fetch(`${import.meta.env.VITE_URL_BASE}/trays`,{
                                                    method:'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    },
                                                    body:new URLSearchParams(data)
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        updateTrays(data.data,'inprocess');
                                                        
                                                        if(data.state===200){
                                                            setNext(index);
                                                            e.target.textContent="Seguir";
                                                        }
                                                    });
                                            }else{
                                                setNext(index);
                                                e.target.textContent="Seguir";
                                            }

                                        }else{
                                            if(state_gestion){
                                                setNext(index);
                                                setTotalTray(total-1);
                                            }else{
                                                
                                                sendpush({
                                                    title:'Gestión en curso.',
                                                    message:'Se ha realizado una llamada con estado CONTACTADO y no se ha guardado gestión.',
                                                    type:'Push--sucessful',
                                                    timeout:3000
                                                });
                                            }
                                        }
                                        
                                    }else{
                                        setNext(index);
                                    }

                                    let elements=document.getElementsByClassName('DetailCredit__body--focus');
                                        elements=[].slice.call(elements);

                                    elements.map((ele)=>{
                                        ele.classList.remove('DetailCredit__body--focus');
                                    });

                                    ref_titular.current.classList.add('DetailCredit__body--focus');
                                }}
                            >
                                Seguir
                            </button>
                        </div>

                        <form ref={form} className="Ggestion__form">
                            <div className="Ggestion__threeGroup">

                                <label className="Ggestion__input">
                                    Nombre del contacto
                                    <input 
                                        type="text" 
                                        placeholder="NOMBRE DEL CLIENTE"
                                        value={data_gestion.client_name}
                                    />
                                </label>

                                <label className="Ggestion__select">
                                    Estado
                                    <select 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                state_gestion:e.target.value
                                            });
                                        }}
                                        value={data_gestion.state_gestion}
                                    >
                                        <option>-- Seleccionar estado --</option>
                                        {
                                            template.states.map((option,index)=>(
                                                <option key={index} value={option}>{option}</option>
                                            ))
                                        }
                                    </select>
                                </label>

                                <label className="Ggestion__select">
                                    Subestado
                                    <select
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                substate_gestion:e.target.value
                                            });
                                        }} 
                                        value={data_gestion.substate_gestion}
                                    >
                                        <option value={""}>-- Seleccionar --</option>
                                        {
                                            template.substates.map((option)=>(
                                                (option.title===data_gestion.state_gestion) &&
                                                    option.options.map((sub,index)=>(
                                                        <option key={index} value={sub}>{sub}</option>
                                                    ))
                                            ))
                                        }
                                    </select>
                                </label>
                            </div>

                            <div className="Ggestion__twoGroup">
                                <label className="Ggestion__input" style={{width:"calc((100% / 3) - 15px)"}}>
                                    Fecha de oferta / compromiso
                    
                                    <input
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                date_promise:e.target.value
                                            });
                                        }}
                                        value={data_gestion.date_promise}
                                        type="date" 
                                    />
                                    {
                                        (data_gestion.substate_gestion==='COMPROMISO DE PAGO')
                                        ?   
                                            <label className="Ggestion__input" style={{width:"150px",display:'inline-flex',marginTop:"10px"}}>
                                                Nro. notificación
                                                <input 
                                                    value={data_gestion.nro_notificacion} 
                                                    type="text" 
                                                    placeholder="00XXX"
                                                    onChange={(e)=>{
                                                        setDataGestion({
                                                            ...data_gestion,
                                                            nro_notificacion:e.target.value
                                                        });
                                                    }}
                                                />
                                            </label>
                                        :   <></>
                                    }
                                </label>

                                <label className="Ggestion__input">
                                    Monto a pagar
                                    <div className="Ggestion__inputNumber">
                                        <input 
                                            type="number" 
                                            value={data_gestion.monto_pagar} 
                                            step={0.01}
                                            onChange={(e)=>{
                                                setDataGestion({
                                                    ...data_gestion,
                                                    monto_pagar: e.target.value
                                                });
                                            }}
                                        />

                                        <label>
                                            <input 
                                                type="checkbox"
                                                onChange={(e)=>{
                                                    if(e.target.checked){

                                                        setDataGestion({
                                                            ...data_gestion,
                                                            monto_pagar: (info_credit.collectionState==='Vigente') ? info_credit.monthlyFeeAmount : info_credit.totalAmount
                                                        });

                                                    }else{
                                                        setDataGestion({
                                                            ...data_gestion,
                                                            monto_pagar:0
                                                        });
                                                    }
                                                }}
                                            />
                                            Total
                                        </label>
                                    </div>
                                </label>

                            </div>

                            <div className="Ggestion__oneGroup">
                                <label className="Ggestion__textarea">
                                    Observación
                                    <textarea 
                                        onChange={(e)=>{
                                            setDataGestion({
                                                ...data_gestion,
                                                observation:e.target.value
                                            });
                                        }}
                                        value={data_gestion.observation}
                                        placeholder="Escribe aquí"
                                    >
                                    </textarea>
                                </label>
                            </div>
                        </form>
                    </div>
                    {
                        ((localStorage.getItem('permission').split(',').includes("convenio:set") | localStorage.getItem('permission').split(',').includes("condonar:set")) & bandeja!=='inactive')
                        ?
                            <div className="Ggestion__principalActions">
                                <h3>Acciones</h3>
                                
                                {
                                    (localStorage.getItem('permission').split(',').includes("condonar:set"))
                                    ?
                                        <button 
                                            title="Solicitar condonación"
                                            onClick={async (e)=>{
                                                if(await useVerifyCondonation(currently.id)){
                                                    setViewCondonation(!view_condonation);
                                                }else{
                                                
                                                    sendpush({
                                                        title:'ERR: Condonación existente.',
                                                        message:'No se puede, ya se ha registrado una condonación.',
                                                        type:'Push--danger',
                                                        timeout:3000
                                                    });

                                                    clean;
                                                }
                                            }}
                                        >Condonar</button>
                                    :   <></>
                                }
                                {
                                    (localStorage.getItem('permission').split(',').includes("convenio:set"))
                                    ?
                                        <button
                                            title="Solicitar Convenio de Pago"
                                            onClick={async (e)=>{
                                                if(await useVerifyStruct(currently.id)){
                                                    setReestructurar(!view_reestructurar);
                                                }else{
                                                    sendpush({
                                                        title:'ERR: Convenio existente.',
                                                        message:'No se puede, hay un convenio ya creado.',
                                                        type:'Push--danger',
                                                        timeout:3000
                                                    });
                                                }
                                            }}
                                        >Convenio</button>
                                    :   <></>
                                }
                                {
                                    (info_credit.collectionState==='Convenio de pago')
                                    ?   <button
                                            onClick={async (e)=>{

                                                const request= await fetch(`${import.meta.env.VITE_URL_BASE}/credit/viewconvenio?credito=${info_credit.id}&cartera=${data_gestion.cartera}`,{
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    }
                                                });
                                                
                                                const response=await request.json();
                                                setViewConvenio(true);
                                                setConvenioData(response.data[0]);
                                            }}
                                        >Ver convenio</button>
                                    :   <></>
                                }
                                <button
                                    onClick={async (e)=>{
                                        setViewSendmail(true);
                                    }}
                                >Enviar correo</button>
                                <button
                                    onClick={async (e)=>{
                                        setViewSendsms(true);
                                    }}
                                >Enviar SMS</button>
                            </div>
                        :   <></>
                    }
                </div>

                {
                    (bandeja!=='inactive')
                    ?
                        <div className="Ggestion__buttons">
                            <button
                                className="Ggestion__buttons--save"
                                onClick={(e)=>{

                                    e.target.textContent="Guardando...";
                                
                                    if((data_gestion.date_promise==='' & data_gestion.substate_gestion=='COMPROMISO DE PAGO') | data_gestion.substate_gestion===''){
                                        e.target.textContent="Intentar de nuevo";

                                        sendpush({
                                            title:'ERR: Datos imcompletos.',
                                            message:'Por favor, llene todos los datos de la gestión.',
                                            type:'Push--danger',
                                            timeout:5000
                                        });

                                    }else{

                                        if(incall===false){

                                            if(data_gestion.substate_gestion=='COMPROMISO DE PAGO' & data_gestion.nro_notificacion===""){

                                                sendpush({
                                                    title:'ERR: NRO Notificación.',
                                                    message:'Por favor, ingrese un NRO DE NOTIFICACIÓN para el COMPROMISO DE PAGO, caso contrario, seleccione OFERTA DE PAGO.',
                                                    type:'Push--danger',
                                                    timeout:5000
                                                });

                                                e.target.textContent="Guardar";

                                            }else{
                                                setStatusGestion(true);
                                                const data_send=data_gestion;

                                                if(Array.isArray(data_send.id_calls_extras)){
                                                    if(data_send.id_calls_extras.length>0){
                                                        data_send.id_call=data_send.id_calls_extras[data_send.id_calls_extras.length-1];
                                                    }else{
                                                        data_send.id_call=0;
                                                    }
                                                }else{
                                                    data_send.id_calls_extras=JSON.parse(data_send.id_calls_extras);
                                                    data_send.id_call=data_send.id_calls_extras[data_send.id_calls_extras.length-1];
                                                }

                                                data_send.id_calls_extras=JSON.stringify(data_send.id_calls_extras);
                                                data_send.cartera=localStorage.getItem('cartera');
                                                
                                                fetch(`${import.meta.env.VITE_URL_BASE}/managments`,{
                                                    method:'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem('token')}`
                                                    },
                                                    body:new URLSearchParams(data_send)
                                                })
                                                    .then((response) => response.json())  
                                                    .then((data) => {
                                                        
                                                        if(data.status===200){
                                                            setMessage('Gestionado');

                                                            sendpush({
                                                                title:'Éxito.',
                                                                message:'Gestión guardada correctamente.',
                                                                type:'Push--sucessful',
                                                                timeout:3000
                                                            });

                                                            updateTrays(data.data,'processed');

                                                            let elements=document.getElementsByClassName('DetailCredit__body--focus');
                                                            elements=[].slice.call(elements);

                                                            elements.map((ele)=>{
                                                                ele.classList.remove('DetailCredit__body--focus');
                                                            });

                                                            form.current.reset();

                                                            setDataGestion({
                                                                id_campain:id_campain.split('/')[0],
                                                                id_call:'',
                                                                id_calls_extras:[],
                                                                id_credit:currently.id_credito,
                                                                state_gestion:'',
                                                                substate_gestion:'',
                                                                date_promise:'',
                                                                observation:'',
                                                                byUser:'',
                                                                fecha:'',
                                                                client_name:currently.name,
                                                                cartera:currently.cartera
                                                            });

                                                            setStates([]);

                                                            e.target.textContent="Guardar";
                                                        }else{
                                                            e.target.textContent="Error, inténtalo de nuevo";
                                                        }
                                                    });
                                            }

                                        }else{

                                            sendpush({
                                                title:'ERR: llamada en progreso',
                                                message:'Por favor, termine la llamada o espere que se guarde para registrar gestión.',
                                                type:'Push--warning',
                                                timeout:3000
                                            });

                                            e.target.textContent="Guardar";
                                        }
                                    }
                                }}
                            >Guardar</button>
                        </div>
                    :   <></>
                }

                <div className="Ggestion__historial">
                    <div>

                        <button
                            onClick={(e)=>{
                                setTray('Historial');
                            }}
                        >Historial</button>

                        {
                            (localStorage.getItem('rol')==='campo' | localStorage.getItem('rol')==='administrador' | localStorage.getItem('rol')==='super')
                            ?
                                <>
                                    <button
                                        onClick={(e)=>{
                                            fetch(`${import.meta.env.VITE_URL_BASE}/vouchers/group/${info_credit.id}?cartera=${info_credit.cartera}`,{
                                                headers: {
                                                    Accept: 'application/json',
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                }
                                            })
                                                .then((response) => response.json())  
                                                .then((data) => {
                                                    setPagos(data);
                                                });

                                            setTray('Pagos');
                                        }}
                                    >Pagos</button>

                                    <button
                                        onClick={(e)=>{
                                            setDirecciones(currently.direcciones);
                                            setTray('Direcciones');
                                        }}
                                    >Direcciones</button>
                                </>
                            :   <></>
                        }

                    </div>
                    <div className="Ggestion__historialHead">
                        {
                            (tray==='Historial')
                            ?
                                <>
                                    <label>Fecha</label>
                                    <label>Cliente</label>
                                    <label>Estado de gestión</label>
                                    <label>Fecha compromiso</label>
                                    <label>Observación</label>
                                    <label>Agente</label>
                                </>
                            :
                                (tray==='Pagos')
                                    ?
                                        <>
                                            <label>Fecha pago</label>
                                            <label>Tipo de pago</label>
                                            <label>Monto</label>
                                            <label>Estado</label>
                                        </>
                                    :
                                        <>
                                            <label>Nombre</label>
                                            <label>Ciudad</label>
                                            <label>Parroquia</label>
                                            <label>Dirección</label>
                                            <label>Ubicación</label>
                                        </>
                        }
                    </div>

                    {
                        (tray==='Historial')
                        ?   
                            historial.map((item,index)=>(
                                <div key={index} className="Ggestion__historialItem">
                                    <label>{item.fecha}</label>
                                    <label>{item.client_name}</label>
                                    <label>{item.substate_gestion}</label>
                                    <label>{item.date_promise}</label>
                                    <label>{item.observation}</label>
                                    <label>{item.byUser}</label>
                                </div>
                            ))
                        :   
                            (tray==='Pagos')
                            ?   
                                (pagos.length>0)
                                ?
                                    pagos.map((item,index)=>(
                                        <div key={index} className="Ggestion__historialItem">
                                            <label>{item.fecha}</label>
                                            <label>{item.forma_pago}</label>
                                            <label>{useFormatterNumber({value:Number(item.valor_recibido.replace(',','.')),currency:'USD'})}</label>
                                            <label>{item.status.toUpperCase()}</label>
                                        </div>
                                    ))
                                :   
                                    <div className="Ggestion__historialItem">
                                        <label>Sin pagos</label>
                                    </div>
                            :
                                direcciones.map((item,index)=>(
                                    <div key={index} className="Ggestion__historialItem">
                                        <label>{item.nombre}</label>
                                        <label>{item.ciudad}</label>
                                        <label>{item.parroquia}</label>
                                        <label>{item.direccion}</label>

                                        {
                                            (item.ubicacion.lat!=="")
                                            ?
                                                <Wrapper apiKey="AIzaSyDqk_2FCNezPuFgd8Zaeu2s1idsDpdC1Qc" render={render}>
                                                    <MyMapComponent
                                                        center={{lat:parseFloat(item.ubicacion.lat),lng:parseFloat(item.ubicacion.lng)}}
                                                        zoom={15}
                                                    />
                                                </Wrapper>
                                            :   <p style={{fontWeight:"100",textAlign:"center"}}>No hay ubicación</p>
                                        }
                                        
                                    </div>
                                ))
                    }
                    
                </div>
            </div>
        </div>
    );
}