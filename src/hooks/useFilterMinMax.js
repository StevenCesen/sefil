export default function useFilteMinMax({tray,data_org,value,update,all}){
    let results=[];
    
    if(tray==='pending' & !all){
        // Buscar en pendientes
        data_org.pending.map((credit)=>{
            if(value.min!="" & Number(value.min)!==0 & value.max!=="" & Number(value.max)!==0){
                if(credit.dias_vencidos>=Number(value.min) & credit.dias_vencidos<=Number(value.max)){
                    results.push(credit);
                }
            }else if(value.min!="" & Number(value.min)!==0){
                if(credit.dias_vencidos>=Number(value.min)){
                    results.push(credit);
                }
            }else if(value.max!=="" & Number(value.max)!==0){
                if(credit.dias_vencidos<=Number(value.max)){
                    results.push(credit);
                }
            }else{
                results.push(credit);
            }
        });

    }else if(tray==='inprocess' & !all){
        // Buscar en proceso
        data_org.inprocess.map((credit)=>{
            if(value.min!="" & Number(value.min)!==0 & value.max!=="" & Number(value.max)!==0){
                if(credit.dias_vencidos>=Number(value.min) & credit.dias_vencidos<=Number(value.max)){
                    results.push(credit);
                }
            }else if(value.min!="" & Number(value.min)!==0){
                if(credit.dias_vencidos>=Number(value.min)){
                    results.push(credit);
                }
            }else if(value.max!=="" & Number(value.max)!==0){
                if(credit.dias_vencidos<=Number(value.max)){
                    results.push(credit);
                }
            }else{
                results.push(credit);
            }
        });
       
    }else if(tray==='processed' & !all){
        // Buscar en procesados
        data_org.processed.map((credit)=>{
            if(value.min!="" & Number(value.min)!==0 & value.max!=="" & Number(value.max)!==0){
                if(credit.dias_vencidos>=Number(value.min) & credit.dias_vencidos<=Number(value.max)){
                    results.push(credit);
                }
            }else if(value.min!="" & Number(value.min)!==0){
                if(credit.dias_vencidos>=Number(value.min)){
                    results.push(credit);
                }
            }else if(value.max!=="" & Number(value.max)!==0){
                if(credit.dias_vencidos<=Number(value.max)){
                    results.push(credit);
                }
            }else{
                results.push(credit);
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