export default function useAssignSearch(data,value,update,filter,mode,mora,cuota,monto,estado,agencia,estado_gestion){

    if(filter){
        let results=[];

        data.map((credit)=>{
            if(Number(mode)===1){ //Modo coincidir
                if(
                    mora==='' & 
                    cuota==='' &
                    monto===''
                ){
                    if(estado!=="" & estado_gestion!==""){
                        
                        if(credit.collectionState===estado & credit.managementState===estado_gestion){
                            results.push(credit);
                        }

                    }else if(estado!=="" & estado_gestion===""){
                        
                        if(credit.collectionState===estado){
                            results.push(credit);
                        }

                    }else if(estado_gestion!=="" & estado===""){
                        
                        if(credit.managementState===estado_gestion){
                            results.push(credit);
                        }

                    }else{
                        results.push(credit)
                    }

                }else{
                    if(
                        ( ((mora!=="") 
                            ? 
                                ((Number(mora.min)!==0 & mora.min!=="") & (Number(mora.max)!==0 & mora.max!==""))
                                ?
                                    (Number(credit.dias_vencidos)>=Number(mora.min) & Number(credit.dias_vencidos)<=Number(mora.max))
                                :   (Number(mora.min)!==0 & mora.min!=="")
                                    ?   (Number(credit.dias_vencidos)>=Number(mora.min))
                                    :   (mora.max!=="" & Number(mora.max)!==0)
                                        ?
                                            (Number(credit.dias_vencidos)<=Number(mora.max))
                                        :   true
                            :   true)
                            
                            &   ((estado!=="") ? estado===credit.collectionState :   true)
                            &   ((estado_gestion!=="") ? estado_gestion===credit.managementState :   true)
                        )   
                            &
                        ( ((cuota!=="") 
                            ?
                                ((Number(cuota.min)!==0 & cuota.min!=="") & (Number(cuota.max)!==0 & cuota.max!==""))
                                ?
                                    (Number(credit.pendingFees)>=Number(cuota.min) & Number(credit.pendingFees)<=Number(cuota.max)) 
                                :   (Number(cuota.min)!==0 & cuota.min!=="")
                                    ?
                                        Number(credit.pendingFees)>=Number(cuota.min)
                                    :   (cuota.max!=="" & Number(cuota.max)!==0 )
                                        ?
                                            Number(credit.pendingFees)<=Number(cuota.max)
                                        :   true
                            :   true)
                            
                            &   ((estado!=="") ? estado===credit.collectionState :   true)
                            &   ((estado_gestion!=="") ? estado_gestion===credit.managementState :   true)
                            
                        )   &
                        ( ((monto!=="") 
                            ?   
                                ((Number(monto.min)!==0 & monto.min!=="") & (Number(monto.max)!==0 & monto.max!==""))
                                ?
                                    Number(credit.totalAmount)>=Number(monto.min) & Number(credit.totalAmount)<=Number(monto.max) 
                                :   (Number(monto.min)!==0 & monto.min!=="")
                                    ?
                                        Number(credit.totalAmount)>=Number(monto.min)
                                    :   (monto.max!=="" & Number(monto.max)!==0)
                                        ?
                                            Number(credit.totalAmount)<=Number(monto.max)
                                        :   true
                            : true)
                            &   ((estado!=="") ? estado===credit.collectionState :   true)
                            &   ((estado_gestion!=="") ? estado_gestion===credit.managementState :   true)
                        )  
                        //credit.collectionState===estado
                    ){
                        results.push(credit);
                    }
                }

            }else{ //Modo no coincidir
                if(
                    mora==='' & 
                    cuota==='' &
                    monto==='' &
                    estado!==''
                ){
                    if(credit.collectionState!==estado){
                        results.push(credit);
                    }

                }else{
                    if(
                        ((mora!=="") ? (Number(credit.dias_vencidos)>=Number(mora.min) & Number(credit.dias_vencidos)<=Number(mora.max)) : true) &
                        ((cuota!=="") ? (Number(credit.pendingFees)>=Number(cuota.min) & Number(credit.pendingFees)<=Number(cuota.max)) : true) &
                        ((monto!=="") ? (Number(credit.totalAmount)>=Number(monto.min) & Number(credit.totalAmount)<=Number(monto.max)) : true)
                        //credit.collectionState===estado
                    ){
                        credit.search=false;

                    }else{
                        results.push(credit);
                    }
                }
                
            }
        });

        if(agencia.length>0){
            let new_result=[];

            results.map((credit)=>{
                agencia.map((agency)=>{
                    if(agency.toLowerCase()===credit.agency.toLowerCase()){
                        new_result.push(credit);
                    }
                });
            });

            update(new_result);

        }else{
            update(results);
        }

    }else if(value.length>3){

        if(value.includes(' ')[1]===undefined){
            if(value.split('-')[1]===undefined){ //Selecciono según el nombre
                let results=[];
    
                data.map((credit)=>{
                    if(credit.name.toLowerCase().includes(value.toLowerCase())){
                        results.push(credit);
                    }
                });
                
                update(results);
            }else{
                
                let results=[];

                data.map((credit)=>{
                    if(credit.credito.includes(value.split('-')[1])){
                        results.push(credit);
                    }
                });

                if(results.length===0){
                    JSON.parse(localStorage.getItem('filt')).map((credit)=>{
                        if(credit.credito.includes(value.split('-')[1])){
                            results.push(credit);
                        }
                    });
                }

                update(results);
            }

        }else{  //Búsqueda masiva de créditos
            let values=value.split(' ');
            let results=[];
            
            if(value.includes(' ')){
                values.map((credit_s)=>{
                    let credito=[];

                    data.map((credit)=>{
                        if(credit.credito===credit_s.split('-')[1]){
                            credito=credit;
                        }
                    });

                    ('name' in credito) ? results.push(credito) : "";
                });

                update(results);

                if(results.length===0){
                    let values=value.split(' ');
                    let results=[];
    
                    values.map((credit_s)=>{
                        let credito=[];
    
                        JSON.parse(localStorage.getItem('filt')).map((credit)=>{
                            if(credit.credito===credit_s.split('-')[1]){
                                credito=credit;
                            }
                        });
    
                        results.push(credito);
                    })
                    
                    update(results);
                }
            }
        }
        
    }else{
        update(data);
    }
}