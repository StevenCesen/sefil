export default function useAssignSearch(data,value,update,filter,mode,mora,cuota,monto,estado,agencia){

    if(filter){
        let results=[];

        data.map((credit)=>{
            if(Number(mode)===1){ //Modo coincidir
                // Compruebo si los valores de rango vienen vacios entonces solo busco por estado o agencia
                if(
                    mora==='' & 
                    cuota==='' &
                    monto==='' &
                    estado!==''
                ){
                    if(credit.collectionState===estado){
                        results.push(credit);
                    }
                }else{
                    if(
                        (Number(credit.dias_vencidos)>=Number(mora.min) & Number(credit.dias_vencidos)<=Number(mora.max)) &
                        (Number(credit.pendingFees)>=Number(cuota.min) & Number(credit.pendingFees)<=Number(cuota.max)) &
                        (Number(credit.totalAmount)>=Number(monto.min) & Number(credit.totalAmount)<=Number(monto.max)) &
                        credit.collectionState===estado
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
                        (Number(credit.dias_vencidos)>=Number(mora.min) & Number(credit.dias_vencidos)<=Number(mora.max)) &
                        (Number(credit.pendingFees)>=Number(cuota.min) & Number(credit.pendingFees)<=Number(cuota.max)) &
                        (Number(credit.totalAmount)>=Number(monto.min) & Number(credit.totalAmount)<=Number(monto.max)) &
                        credit.collectionState===estado
                    ){
                        credit.search=false;
                    }else{
                        results.push(credit);
                    }
                }
                
            }
        });

        // Al final de tener todo el results filtro por agencia
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

        if(/^[A-Za-z ]+/.test(value)){ //Selecciono según el nombre
            let results=[];

            data.map((credit)=>{
                if(credit.name.toLowerCase().includes(value.toLowerCase())){
                    results.push(credit);
                }
            });
            
            update(results);

        }else{ //Aquí buscamos según la cédula

            if(value.includes(' ')){

                // Aquí tenemos todo el array de créditos que hay que activar
                let values=value.split(' ');
                let results=[];

                values.map((credit_s)=>{
                    let credito=[];

                    data.map((credit)=>{
                        if(credit.ci===credit_s){
                            credito=credit;
                        }
                    });
                    results.push(credito);
                });
                
                update(results);

            }else{
                
                let results=[];

                data.map((credit)=>{
                    if(credit.ci.includes(value)){
                        results.push(credit);
                    }
                });

                update(results);
            }

        }
        
    }else{
        update(data);
    }
}