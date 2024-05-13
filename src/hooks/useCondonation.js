export default async function useCondonation(data,btn,id,setData,view,set,update){
    const request= await fetch(`https://sefil.softsen.space/public/api/credit/condonar/${id}`,{
        method:'POST',
        body:new URLSearchParams(data),
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const response=await request.json();

    if(response.status===200){
        
        data.by_user=response.by_user;
        data.fecha=response.fecha;
        data.ci=response.ci;
        data.name=response.name;
        
        update({
            capital:data.saldo_capital,
            interes:data.interes,
            mora:data.mora,
            seguro_desgravamen:data.seguro_desgravamen,
            gastos_judiciales:data.gastos_judiciales,
            gastos_cobranza:data.gastos_cobranza,
            otros_valores:data.otros_valores,
            totalAmount:data.totalAmount
        }); 

        setData(data);
        btn.textContent='Condonación guardada';
        btn.setAttribute('disabled','');
        set();
        view();
    }else{
        btn.textContent='Inténtalo de nuevo';
        btn.removeAttribute('disabled','');
    }
}