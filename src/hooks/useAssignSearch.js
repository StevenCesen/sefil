export default function useAssignSearch(data,value,update,filter,mode,mora,cuota,monto,estado,agencia,estado_gestion,agente,business_id,setCreditos){

    if(filter){
        /**
     * =========================================================================================
     *     Búsqueda mediante rangos de mora, cuotas, montos, estado y estado de gestión.
     * =========================================================================================
    */
        let results=[];

        if(Number(mode)===1){ //Modo coincidir
            if(
                mora==='' &
                cuota==='' &
                monto==='' &
                estado_gestion==='' &
                estado==='' &
                agencia===''
            ){

                results=data;

            }else{
                let filters="";

                if(mora!==""){
                    if(mora.min!=="" & Number(mora.min)!==0){
                        filters+=`&days_past_due_min=${mora.min}`;
                    }
                    if(mora.max!=="" & Number(mora.max)!==0){
                        filters+=`&days_past_due_max=${mora.max}`;
                    }
                }

                if(monto!==""){
                    if(monto.min!=="" & Number(monto.min)!==0){
                        filters+=`&total_amount_min=${monto.min}`;
                    }

                    if(monto.max!=="" & Number(monto.max)!==0){
                        filters+=`&total_amount_max=${monto.max}`;
                    }
                }

                if(cuota!==""){
                    if(cuota.min!=="" & Number(cuota.min)!==0){
                        filters+=`&total_fees_min=${cuota.min}`;
                    }

                    if(cuota.max!=="" & Number(cuota.max)!==0){
                        filters+=`&total_fees_max=${cuota.max}`;
                    }
                }

                if(estado_gestion!==""){
                    filters+=`&status_management=${estado_gestion}`;
                }

                if(estado!==""){
                    filters+=`&collection_state=${estado}`;
                }

                if(agencia.length>0){
                    filters+=`&agencies=${JSON.stringify(agencia)}`;
                }

                if(!Array.isArray(agente)){
                    filters+=`&user_id=${agente}`;
                }else{
                    filters+=`&user_ids=${JSON.stringify(agente)}`
                }

                fetch(`${import.meta.env.VITE_URL_BASE}/credits?business_id=${business_id}${filters}`,{
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then((response) => response.json())
                    .then((data) => {
                        const credits = data?.result?.data || data?.data || data;
                        update(credits);
                    });
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

    /** 
     * =========================================================================================
     *               Búsqueda mediante nombre, crédito o listado de créditos
     * =========================================================================================
    */

    }else if(value.length>3){
        if(/^[A-Za-z ]+/.test(value) & !/[0-9]+/.test(value)){

        }else if(/^[0-9-_A-Za-z ]+/.test(value)){  //Búsqueda masiva de créditos
            let values=value.split(' ');
            let syncs_id=[];

            values.map((value)=>{
                syncs_id.push(value.split('-')[1]);
            });

            setCreditos(syncs_id);

            fetch(`${import.meta.env.VITE_URL_BASE}/credits?business_id=${business_id}&credit_numbers=${JSON.stringify(syncs_id)}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    const credits = data?.result?.data || data?.data || data;
                    update(credits);
                });
        }
    }else{
        update(data);
    }
}