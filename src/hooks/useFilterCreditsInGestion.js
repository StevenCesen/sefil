export default function useFilterCreditsInGestion({campain,name,ci,agencia,mora,state_gestion,agente,setData}){
    let filters="";

    if(campain!==""){
        filters+=`&campain=${campain}`;
    }

    if(name!==""){
        filters+=`&name=${name}`;
    }

    if(ci!==""){
        filters+=`&ci=${ci}`;
    }

    if(mora!==""){
        if((mora.min!=="" & Number(mora.min)!==0) & (mora.max!=="" & Number(mora.max)!==0)){
            filters+=`&mora_min=${mora.min}&mora_max=${mora.min}`;
        }else if((mora.min!=="" & Number(mora.min)!==0)){
            filters+=`&mora_min=${mora.min}`;
        }else{
            filters+=`&mora_max=${mora.min}`;
        }
    }

    if(state_gestion!==""){
        filters+=`&campo=substate_gestion&value=${state_gestion}`;
    }

    if(agencia!==""){
        filters+=`&agencia=${agencia}`;
    }

    // if(date_promise!==""){
    //     filters+=`&promise=${date_promise}`;
    // }
    
    console.log(filters)

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
        });
}