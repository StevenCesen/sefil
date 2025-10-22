export default async function useCondonation(data,btn,id,setPDF){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/credit/condonar/${id}`,{
        method:'POST',
        body:new URLSearchParams(data),
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const response=await request.json();

    if(response.status===200){
        // if(update!==null){
        //     update({
        //         capital:data.saldo_capital,
        //         interes:data.interes,
        //         mora:data.mora,
        //         seguro_desgravamen:data.seguro_desgravamen,
        //         gastos_judiciales:data.gastos_judiciales,
        //         gastos_cobranza:data.gastos_cobranza,
        //         otros_valores:data.otros_valores,
        //         totalAmount:data.totalAmount
        //     }); 
        // }
        console.log(response);
        setPDF(response.data);
        btn.textContent='Condonación guardada';
        btn.setAttribute('disabled','');
    }else{
        btn.textContent='Inténtalo de nuevo';
        btn.removeAttribute('disabled','');
    }
}