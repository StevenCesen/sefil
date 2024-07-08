export default function useAssignSearch(data_original,value,update,filter,mode,mora,cuota,monto,estado,agencia){
    let results=[];
    
    if(filter){
        let data=data_original;

        data.map((credit)=>{
            if(Number(mode)===1){
                if(
                    (Number(credit.dias_vencidos)>=Number(mora.min) & Number(credit.dias_vencidos)<=Number(mora.max)) &
                    (Number(credit.pendingFees)>=Number(cuota.min) & Number(credit.pendingFees)<=Number(cuota.max)) &
                    (Number(credit.totalAmount)>=Number(monto.min) & Number(credit.totalAmount)<=Number(monto.max))
                ){
                    credit.search=true;
                }else{
                    credit.search=false;
                }
            }else{
                if(
                    (Number(credit.dias_vencidos)>=Number(mora.min) & Number(credit.dias_vencidos)<=Number(mora.max)) &
                    (Number(credit.pendingFees)>=Number(cuota.min) & Number(credit.pendingFees)<=Number(cuota.max)) &
                    (Number(credit.totalAmount)>=Number(monto.min) & Number(credit.totalAmount)<=Number(monto.max))
                ){
                    credit.search=false;
                }else{
                    credit.search=true;
                }
            }

            results.push(credit);
            
        });

        update(results);

    }else if(value.length>4){
        let data=data_original;

        if(/^[A-Za-z ]+/.test(value)){ //Selecciono según el nombre
            data.map((credit)=>{
                if(credit.name.toLowerCase().includes(value.toLowerCase())){
                    credit.search=true;
                }else{
                    credit.search=false;
                }
                results.push(credit);
            });
            update(results);
        }else{
            let data=data_original;

            if(value.includes(' ')){

                // Aquí tenemos todo el array de créditos que hay que activar
                let values=value.split(' ');

                data.map((credit)=>{
                    credit.search=false;
                });

                values.map((credit_s)=>{
                    let credito=[];
                    data.map((credit)=>{
                        if(credit.ci===credit_s){
                            credit.search=true;
                            credito=credit;
                        }
                    });
                    results.push(credito);
                });

                console.log(data);
                
            }else{
                data.map((credit)=>{
                    if(credit.ci.includes(value)){
                        credit.search=true;
                    }else{
                        credit.search=false;
                    }
                    results.push(credit);
                });
            }

            update(results);
        }
    }else{
        let data=data_original;

        data.map((credit)=>{
            credit.search=true;
            results.push(credit);
        })

        update(results);
    }
}