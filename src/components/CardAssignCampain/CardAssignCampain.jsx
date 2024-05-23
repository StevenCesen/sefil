export default function CardAssignCampain({id_campain,agents,data}){
    return (
        <div className="CardAssignCampain">
            <p className="CardAssignCampain__head">Asignación de campaña</p>
            <label>
                Agente
                <select>
                    <option value={"Cecibel Torres"}>Cecibel Torres</option>
                </select>
            </label>
            
            <span>Forma de asignación</span>
            <div>
                <label>
                    <input type="checkbox"/>
                    Manual
                </label>
                <label>
                    <input type="checkbox"/>
                    Transferir carga
                </label>
            </div>

            <label>
                Cargar datos
                <input type="file"/>
            </label>

            

        </div>
    );
}