// Normaliza el objeto de crédito al formato que esperan CardPay, CardConfirm, etc.
export function buildCreditPayload(credit) {
    return {
        ...credit,
        totalAmount: credit.total_amount,
        saldo_capital: credit.capital,
        interes: credit.interest,
        seguro_desgravamen: credit.safe,
        gastos_cobranza: credit.collection_expenses,
        gastos_judiciales: credit.legal_expenses,
        otros_valores: credit.other_values,
    };
}
