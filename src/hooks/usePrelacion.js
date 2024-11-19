export default function usePrelacion(value,data_original,setPrelacion,setData,orden){
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

    if(calcRestante(Number(value),Number(data_original[orden[0]]))){ //El monto abonado si alcanza para cancelar toda la mora
        value=value-Number(data_original[orden[0]]);

        if(calcRestante(Number(value),Number(data_original[orden[1]]))){ //El monto abonado si alcanza para cancelar toda el interés
            value=value-Number(data_original[orden[1]]);

            if(calcRestante(Number(value),Number(data_original[orden[2]]))){ //El monto abonado si alcanza para cancelar todo el seguro
                value=value-Number(data_original[orden[2]]);

                if(calcRestante(Number(value),Number(data_original[orden[3]]))){ //El monto abonado si alcanza para cancelar todos los gastos judiciales
                    value=value-Number(data_original[orden[3]]);

                    if(calcRestante(Number(value),Number(data_original[orden[4]]))){
                        value=value-Number(data_original[orden[4]]);

                        if(calcRestante(Number(value),Number(data_original[orden[5]]))){ //El monto abonado si alcanza para cancelar todo el capital
                            value=value-Number(data_original[orden[5]]);
                    
                            if(calcRestante(Number(value),Number(data_original[orden[6]]))){ //El monto abonado si alcanza para cancelar todos los gastos de cobranza
                                value=value-Number(data_original[orden[6]]);
                                //AQUÍ FINALIZA EL PROGRAMA
                            }else{
                                prelacion[orden[6]]=Number(data_original[orden[6]])-Number(value);
    
                                prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza)+Number(prelacion.otros_valores);
                            }
                    
                        }else{
                            prelacion[orden[5]]=Number(data_original[orden[5]])-Number(value);
                            prelacion[orden[6]]=data_original[orden[6]];
    
                            prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza)+Number(prelacion.otros_valores);
                        
                        }

                    }else{
                        prelacion[orden[4]]=Number(data_original[orden[4]])-Number(value);
                        prelacion[orden[5]]=data_original[orden[5]];
                        prelacion[orden[6]]=data_original[orden[6]];
    
                        prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza)+Number(prelacion.otros_valores);
                        
                    }

                }else{
                    prelacion[orden[3]]=Number(data_original[orden[3]])-Number(value);
                    prelacion[orden[4]]=data_original[orden[4]];
                    prelacion[orden[5]]=data_original[orden[5]];
                    prelacion[orden[6]]=data_original[orden[6]];

                    prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza)+Number(prelacion.otros_valores);
                    
                }

            }else{
                prelacion[orden[2]]=Number(data_original[orden[2]])-Number(value);
                prelacion[orden[3]]=data_original[orden[3]];
                prelacion[orden[4]]=data_original[orden[4]];
                prelacion[orden[5]]=data_original[orden[5]];
                prelacion[orden[6]]=data_original[orden[6]];
                prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza)+Number(prelacion.otros_valores);
                
            }

        }else{
            prelacion[orden[1]]=Number(data_original[orden[1]])-Number(value);
            prelacion[orden[2]]=data_original[orden[2]];
            prelacion[orden[3]]=data_original[orden[3]];
            prelacion[orden[4]]=data_original[orden[4]];
            prelacion[orden[5]]=data_original[orden[5]];
            prelacion[orden[6]]=data_original[orden[6]];
            prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza)+Number(prelacion.otros_valores);
        }
    }else{
        prelacion[orden[0]]=Number(data_original[orden[0]])-Number(value);
        prelacion[orden[1]]=data_original[orden[1]];
        prelacion[orden[2]]=data_original[orden[2]];
        prelacion[orden[3]]=data_original[orden[3]];
        prelacion[orden[4]]=data_original[orden[4]];
        prelacion[orden[5]]=data_original[orden[5]];
        prelacion[orden[6]]=data_original[orden[6]];
        prelacion.totalAmount=Number(prelacion.mora)+Number(prelacion.interes)+Number(prelacion.seguro_desgravamen)+Number(prelacion.gastos_judiciales)+Number(prelacion.saldo_capital)+Number(prelacion.gastos_cobranza)+Number(prelacion.otros_valores);
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