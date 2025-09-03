export default function SelectSubStateManagement({title}){
    return (
        <label>
            {title}
            <select>
                <option value={"PENDIENTE"}>PENDIENTE</option>
                <option value={"EN PROCESO"}>EN PROCESO</option>
                <option value={"COMPROMISO DE PAGO"}>COMPROMISO DE PAGO</option>
                <option value={"OFERTA DE PAGO"}>OFERTA DE PAGO</option>
                <option value={"MENSAJE A TERCEROS"}>MENSAJE A TERCEROS</option>
                <option value={"MENSAJE EN BUZÓN DEL CLIENTE"}>MENSAJE EN BUZÓN DEL CLIENTE</option>
                <option value={"YA PAGÓ"}>YA PAGÓ</option>
                <option value={"MENSAJE DE TEXTO"}>MENSAJE DE TEXTO</option>
                <option value={"SOLICITA REFINANCIAMIENTO"}>SOLICITA REFINANCIAMIENTO</option>
                <option value={"CLIENTE SE NIEGA A PAGAR"}>CLIENTE SE NIEGA A PAGAR</option>
                <option value={"SUSPENDIDO POR FALTA DE PAGO"}>SUSPENDIDO POR FALTA DE PAGO</option>
                <option value={"FUERA DEL AREA DE COBERTURA"}>FUERA DEL AREA DE COBERTURA</option>
                <option value={"CLIENTE INDICA QUE NO ES SU DEUDA"}>CLIENTE INDICA QUE NO ES SU DEUDA</option>
                <option value={"NUMERO INCORRECTO"}>NUMERO INCORRECTO</option>
                <option value={"PASAR A TRAMITE LEGAL"}>PASAR A TRAMITE LEGAL</option>
                <option value={"VOLVER A LLAMAR"}>VOLVER A LLAMAR</option>
                <option value={"NO CONTESTA"}>NO CONTESTA</option>
                <option value={"CONVENIO DE PAGO"}>CONVENIO DE PAGO</option>
                <option value={"CONTACTO INDICA QUE ESTA EQUIVOCADO"}>CONTACTO INDICA QUE ESTA EQUIVOCADO</option>
                <option value={"CLIENTE ESCUCHA Y NO HABLA"}>CLIENTE ESCUCHA Y NO HABLA</option>
                <option value={"CLIENTE ESTA OCUPADO"}>CLIENTE ESTA OCUPADO</option>
                <option value={"CONTESTA MENOR DE EDAD"}>CONTESTA MENOR DE EDAD</option>
                <option value={"CORTA LA LLAMADA"}>CORTA LA LLAMADA</option>
                <option value={"INUBICABLE"}>INUBICABLE</option>
                <option value={"NO VIVE EN LA MISMA DIRECCIÓN"}>NO VIVE EN LA MISMA DIRECCIÓN</option>
                <option value={"Recopilación de Información"}>Recopilación de Información</option>
                <option value={"Presentación demanda"}>Presentación demanda</option>
                <option value={"Citación judicial"}>Citación judicial</option>
                <option value={"Ejecución"}>Ejecución</option>
                <option value={"Peritaje"}>Peritaje</option>
                <option value={"Embargo"}>Embargo</option>
                <option value={"Sentencia"}>Sentencia</option>
                <option value={"Archivo demanda"}>Archivo demanda</option>
                <option value={"NOTIFICADO EXTRAJUDICIAL"}>NOTIFICADO EXTRAJUDICIAL</option>
                <option value={"Envío notificación"}>Envío notificacion</option>
                <option value={"Continuar con gestión extrajudicial"}>Continuar con gestión extrajudicial</option>
            </select>
        </label>
    );
}