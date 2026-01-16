export default function usePrelacion(value, data_original, setPrelacion, setData, orden) {
    let prelacion = {
        totalAmount: 0.00,
        saldo_capital: 0.00,
        interes: 0.00,
        mora: 0.00,
        seguro_desgravamen: 0.00,
        gastos_cobranza: 0.00,
        gastos_judiciales: 0.00,
        otros_valores: 0.00
    };

    let remainingValue = Number(value);

    // Recorrer cada rubro en orden de prelación
    for (let i = 0; i < orden.length; i++) {
        const rubro = orden[i];
        const rubroValue = Number(data_original[rubro]) || 0;

        // Si el rubro está en cero, saltar al siguiente
        if (rubroValue === 0) {
            continue;
        }

        if (remainingValue >= rubroValue) {
            // El pago cubre todo este rubro
            remainingValue -= rubroValue;
            // prelacion[rubro] queda en 0 (ya inicializado)
        } else {
            // El pago no alcanza para cubrir todo el rubro
            prelacion[rubro] = rubroValue - remainingValue;
            remainingValue = 0;

            // Los rubros restantes mantienen su valor original
            for (let j = i + 1; j < orden.length; j++) {
                const rubroRestante = orden[j];
                const valorRestante = Number(data_original[rubroRestante]) || 0;
                if (valorRestante > 0) {
                    prelacion[rubroRestante] = valorRestante;
                }
            }
            break;
        }
    }

    // Calcular el total
    prelacion.totalAmount = Number(prelacion.mora) +
        Number(prelacion.interes) +
        Number(prelacion.seguro_desgravamen) +
        Number(prelacion.gastos_judiciales) +
        Number(prelacion.saldo_capital) +
        Number(prelacion.gastos_cobranza) +
        Number(prelacion.otros_valores);

    setPrelacion(prelacion);
    setData(prelacion);
}
