export default function useReturnFilter({fecha_gestion,campain,name,ci,type,state_gestion,date_promise,agente}){
    let filters="";

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

    return filters;
}