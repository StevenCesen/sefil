export default function useFilterAgency({tray,data_org,value,update,all}){
    let results=[];

    if(tray==='pending' & !all){
        // Buscar en pendientes
        data_org.pending.map((credit)=>{
            if(credit.agency===value.toUpperCase()){
                results.push(credit);
            }
        });

    }else if(tray==='inprocess' & !all){
        // Buscar en proceso
        data_org.inprocess.map((credit)=>{
            if(credit.agency===value.toUpperCase()){
                results.push(credit);
            }
        });
       
    }else if(tray==='processed' & !all){
        // Buscar en procesados
        data_org.processed.map((credit)=>{
            if(credit.agency===value.toUpperCase()){
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