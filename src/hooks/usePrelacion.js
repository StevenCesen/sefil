export default function usePrelacion(value,data_original,setPrelacion,setData){

    let prelacion={
        totalAmount:0.00,
        saldo_capital:0.00,
        interes:0.00,
        mora:0.00,
        seguro_desgravamen:0.00,
        gastos_cobranza:0.00,
        gastos_judiciales:0.00,
        otros_valores:0.00
    };

    if(calcRestante(Number(value),Number(data_original.mora))){
        value=value-Number(data_original.mora);

        if(calcRestante(Number(value),Number(data_original.interes))){
            value=value-Number(data_original.interes);

            if(calcRestante(Number(value),Number(data_original.seguro_desgravamen))){
                value=value-Number(data_original.seguro_desgravamen);

                if(calcRestante(Number(value),Number(data_original.gastos_judiciales))){
                    value=value-Number(data_original.gastos_judiciales);
                    if(calcRestante(Number(value),Number(data_original.saldo_capital))){
                        value=value-Number(data_original.saldo_capital);

                        if(calcRestante(Number(value),Number(data_original.gastos_cobranza))){
                            value=value-Number(data_original.gastos_cobranza);
                        }else{
                            prelacion.gastos_cobranza=Number(data_original.gastos_cobranza)-Number(value);
                            prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza);
                        }

                    }else{
                        prelacion.saldo_capital=Number(data_original.saldo_capital)-Number(value);
                        prelacion.gastos_cobranza=data_original.gastos_cobranza;
                        prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza);
                    }

                }else{
                    prelacion.gastos_judiciales=Number(data_original.gastos_judiciales)-Number(value);
                    prelacion.saldo_capital=data_original.saldo_capital;
                    prelacion.gastos_cobranza=data_original.gastos_cobranza;
                    prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza);
                }

            }else{
                prelacion.seguro_desgravamen=Number(data_original.seguro_desgravamen)-Number(value);
                prelacion.gastos_judiciales=data_original.gastos_judiciales;
                prelacion.saldo_capital=data_original.saldo_capital;
                prelacion.gastos_cobranza=data_original.gastos_cobranza;
                prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza);
            }

        }else{
            prelacion.interes=Number(data_original.interes)-Number(value);
            prelacion.seguro_desgravamen=data_original.seguro_desgravamen;
            prelacion.gastos_judiciales=data_original.gastos_judiciales;
            prelacion.saldo_capital=data_original.saldo_capital;
            prelacion.gastos_cobranza=data_original.gastos_cobranza;
            prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza);
        }
    }else{
        prelacion.mora=Number(data_original.mora)-Number(value);
        prelacion.interes=data_original.interes;
        prelacion.seguro_desgravamen=data_original.seguro_desgravamen;
        prelacion.gastos_judiciales=data_original.gastos_judiciales;
        prelacion.saldo_capital=data_original.saldo_capital;
        prelacion.gastos_cobranza=data_original.gastos_cobranza;
        prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza);
    }

    setPrelacion(prelacion);
    setData(prelacion);
}


function calcRestante(value1,value2){
    if((value1-value2)>0){
        return true;
    }else{
        return false;
    }
}