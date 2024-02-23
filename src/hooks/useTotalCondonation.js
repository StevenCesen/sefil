export default function useTotalCondonation(prevDates,postDates){
    const capital=Number(JSON.parse(prevDates).capital)-Number(JSON.parse(postDates).capital);
    const mora=Number(JSON.parse(prevDates).mora)-Number(JSON.parse(postDates).mora);
    const interes=Number(JSON.parse(prevDates).interes)-Number(JSON.parse(postDates).interes);
    const seguro_desgravamen=Number(JSON.parse(prevDates).seguro_desgravamen)-Number(JSON.parse(postDates).seguro_desgravamen);
    const gastos_judiciales=Number(JSON.parse(prevDates).gastos_judiciales)-Number(JSON.parse(postDates).gastos_judiciales);
    const gastos_cobranza=Number(JSON.parse(prevDates).gastos_cobranza)-Number(JSON.parse(postDates).gastos_cobranza);

    return capital+mora+interes+seguro_desgravamen+gastos_judiciales+gastos_cobranza;
}