export default function useFilterGestions({fecha_gestion,campain,name,ci,type,state_gestion,date_promise,agente,credito,setData,loader,gestion_channel_whatsapp}){
    let filters="";
    loader(true);

    if(fecha_gestion!==""){
        const fecha=`${fecha_gestion.split('-')[0]}/${fecha_gestion.split('-')[1]}/${fecha_gestion.split('-')[2]}`;
        filters+=`&fecha=${fecha}`;
    }

    if(campain!==""){
        filters+=`&campain=${campain}`;
    }

    if(name!==""){
        filters+=`&name=${name}`;
    }

    if(ci!==""){
        filters+=`&ci=${ci}`;
    }

    if(type!==""){
        filters+=`&type=${type}`;
    }

    if(state_gestion!==""){
        filters+=`&campo=substate_gestion&value=${state_gestion}`;
    }

    if(date_promise!==""){
        filters+=`&promise=${date_promise}`;
    }

    if(agente!==""){
        filters+=`&agent=${agente}`;
    }

    if(credito!=="" & credito!==undefined){
        filters+=`&credito=${credito}`;
    }

    if(gestion_channel_whatsapp!==""){
        filters+=`&channel=whatsapp`
    }

    filters=filters.substring(1);

    fetch(`${import.meta.env.VITE_URL_BASE}/managmentall?${filters}`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => response.json())  
        .then((data) => {

            if(data.next_page_url!==null){
                data.next_page_url+=`&${filters}`;
            }
            
            if(data.prev_page_url!==null){
                data.prev_page_url+=`&${filters}`; 
            }

            setData(data);
            loader(false);
        });
}