const MANAGEMENT_STATES = [
    "PENDIENTE",
    "EN PROCESO",
    "COMPROMISO DE PAGO",
    "OFERTA DE PAGO",
    "MENSAJE A TERCEROS",
    "MENSAJE EN BUZÓN DEL CLIENTE",
    "YA PAGÓ",
    "MENSAJE DE TEXTO",
    "SOLICITA REFINANCIAMIENTO",
    "CLIENTE SE NIEGA A PAGAR",
    "SUSPENDIDO POR FALTA DE PAGO",
    "FUERA DEL AREA DE COBERTURA",
    "CLIENTE INDICA QUE NO ES SU DEUDA",
    "NUMERO INCORRECTO",
    "PASAR A TRAMITE LEGAL",
    "VOLVER A LLAMAR",
    "NO CONTESTA",
    "CONVENIO DE PAGO",
    "CONTACTO INDICA QUE ESTA EQUIVOCADO",
    "CLIENTE ESCUCHA Y NO HABLA",
    "CLIENTE ESTA OCUPADO",
    "CONTESTA MENOR DE EDAD",
    "CORTA LA LLAMADA",
    "INUBICABLE",
    "NO VIVE EN LA MISMA DIRECCIÓN",
    "Recopilación de Información",
    "Presentación demanda",
    "Citación judicial",
    "Ejecución",
    "Peritaje",
    "Embargo",
    "Sentencia",
    "Archivo demanda",
    "NOTIFICADO EXTRAJUDICIAL",
    "Envío notificación",
    "Continuar con gestión extrajudicial"
];

export default function SelectManagementStates({ value, onChange }) {
    return (
        <label>
            Estado gestión
            <select
                value={value}
                onChange={(e) => onChange('estado_gestion', e.target.value)}
            >
                <option value="">-- Seleccionar --</option>
                {MANAGEMENT_STATES.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                ))}
            </select>
        </label>
    );
}