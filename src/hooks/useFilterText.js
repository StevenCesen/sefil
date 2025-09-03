export default function useFilterText({tray,data_org,value,update,all,campain}){
    let results=[];

    if(tray==='pending'){
        let campo="";

        if(/^[A-Za-z ]+/.test(value)){
            campo="nombre";
        }else{
            campo="cedula";
        }

        fetch(`${import.meta.env.VITE_URL_BASE}/campains/dates?${campo}=${value}&cartera=${localStorage.getItem('cartera')}&agente=${localStorage.getItem('temp_uS')}&tray=PENDIENTE`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((datas) => {
                datas.map(credito=>{
                    results.push(credito);
                });
                update(results,tray);
            });
    }else if(tray==='inprocess'){
        // Buscar en proceso
        let campo="";

        if(/^[A-Za-z ]+/.test(value)){
            campo="nombre";
        }else{
            campo="cedula";
        }

        fetch(`${import.meta.env.VITE_URL_BASE}/campains/dates?${campo}=${value}&cartera=${localStorage.getItem('cartera')}&agente=${localStorage.getItem('temp_uS')}&tray=EN PROCESO`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((datas) => {
                datas.map(credito=>{
                    results.push(credito);
                });
                update(results,tray);
            });
       
    }else if(tray==='processed'){
        
        let campo="";

        if(/^[A-Za-z ]+/.test(value)){
            campo="nombre";
        }else{
            campo="cedula";
        }

        fetch(`${import.meta.env.VITE_URL_BASE}/campains/dates?${campo}=${value}&cartera=${localStorage.getItem('cartera')}&agente=${localStorage.getItem('temp_uS')}&tray=GESTIONADO`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((datas) => {
                datas.map(credito=>{
                    results.push(credito);
                });
                update(results,tray);
            });

    }else if(all){
        if(tray==='pending'){
            results=data_org.pending;
        }else if(tray==='inprocess'){
            results=data_org.inprocess;
        }else if(tray==='processed'){
            results=data_org.processed;
        }
    }
}