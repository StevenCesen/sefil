export default function useFilterText({tray,data_org,value,update,all}){
    let results=[];

    console.log(tray)
    console.log(data_org)
    console.log(value)

    if(tray==='pending'){
        // Buscar en pendientes
        data_org.pending.map((credit)=>{
            if(/^[A-Za-z ]+/.test(value)){
                if(credit.name.toLowerCase().includes(value.toLowerCase())){
                    results.push(credit);
                }
            }else{
                if(credit.ci.includes(value)){
                    results.push(credit);
                }
            }
        });

    }else if(tray==='inprocess'){
        // Buscar en proceso
        data_org.inprocess.map((credit)=>{
            if(/^[A-Za-z ]+/.test(value)){
                if(credit.name.toLowerCase().includes(value.toLowerCase())){
                    results.push(credit);
                }
            }else{
                if(credit.ci.includes(value)){
                    results.push(credit);
                }
            }
        });
       
    }else if(tray==='processed'){
        // Buscar en procesados
        data_org.processed.map((credit)=>{
            if(/^[A-Za-z ]+/.test(value)){
                if(credit.name.toLowerCase().includes(value.toLowerCase())){
                    results.push(credit);
                }
            }else{
                if(credit.ci.includes(value)){
                    results.push(credit);
                }
            }
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

    update(results,tray);
}