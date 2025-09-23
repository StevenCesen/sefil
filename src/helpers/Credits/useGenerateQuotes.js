import useFadeArray from "../../hooks/useFadeArray";

function calc_next_date(startDate, numDates) {
    let [year, month, day] = startDate.split('-');
    let start = new Date(year, month - 1, day);
    
    let resultDates = [];
    
    for (let i = 0; i <= numDates; i++) {
        let newDate = new Date(start);
        newDate.setMonth(start.getMonth() + i);
        
        if (newDate.getDate() !== start.getDate()) {
            newDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
        }
        
        let year = newDate.getFullYear();
        let month = String(newDate.getMonth() + 1).padStart(2, '0');
        let day = String(newDate.getDate()).padStart(2, '0');
        
        let formattedDate = `${year}-${month}-${day}`;
        resultDates=formattedDate;
    }

    return resultDates;
}

export default async function useGenerateQuotes({
    amount,
    cobranza,
    parameter_name,
    parameter_value,
    start_date,
    setQuote
}){

    const quotes=[];

    //  Gasto de cobranza
    quotes.push({
        cuota:1,
        valor:cobranza,
        estado:'PENDIENTE',
        fecha_pago:start_date
    });

    if(parameter_name==='number_quotes'){
        const quote_value=parseInt(amount/parameter_value);
        const first_quote_value=quote_value-cobranza;
        
        //  Primera cuota
        quotes.push({
            cuota:1,
            valor:first_quote_value,
            estado:'PENDIENTE',
            fecha_pago:start_date,
        });

        //  Generamos un array vacío para llenar los valores de las cuotas
        const arr=await useFadeArray((parameter_value-2));
        
        const check_sum=cobranza+first_quote_value+quote_value*(arr.length);
        
        //  Generamos los valores
        let next_date=start_date;

        arr.map((quote,index)=>{
            next_date=calc_next_date(next_date,1);

            quotes.push({
                cuota:index+2,
                valor:quote_value,
                estado:'PENDIENTE',
                fecha_pago:next_date
            });
        });

        next_date=calc_next_date(next_date,1);

        quotes.push({
            cuota:parameter_value,
            valor:Number((amount-check_sum).toFixed(2)),
            estado:'PENDIENTE',
            fecha_pago:next_date
        });

    }else{
        const amount_quote=parameter_value;
        const first_quote_value=parameter_value-cobranza;

        //  Primera cuota
        quotes.push({
            cuota:1,
            valor:Number(first_quote_value).toFixed(2),
            estado:'PENDIENTE',
            fecha_pago:start_date
        });

        const valid_amount=amount-parameter_value;
        const nro_quotes=parseInt(Number(valid_amount/parameter_value).toFixed(0));

        const total_value_quotes=nro_quotes*parameter_value;
        const last_quote_value=(total_value_quotes===0) ? valid_amount : amount-total_value_quotes;

        const arr=await useFadeArray((nro_quotes-1));

        let next_date=start_date;

        arr.map((quote,index)=>{
            next_date=calc_next_date(next_date,1);
            quotes.push({
                cuota:index+2,
                valor:parameter_value,
                estado:'PENDIENTE',
                fecha_pago:next_date
            });
        });
        
        next_date=calc_next_date(next_date,1);
        quotes.push({
            cuota:nro_quotes+1,
            valor:Number(last_quote_value).toFixed(2),
            estado:'PENDIENTE',
            fecha_pago:next_date
        });
    }

    //  Seteamos las cuotas
    setQuote(quotes);
}