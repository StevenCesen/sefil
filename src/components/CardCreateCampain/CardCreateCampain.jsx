import "./CardCreateCampain.css"

export default function CardCreateCampain({}){
    return (
        <div className="CardCreateCampain">
            <p>Crear campaña</p>

            <label className="CardCreateCampain__input">
                Nombre
                <input type="text" placeholder="Escribe aquí"/>
            </label>

            <div className="CardCreateCampain__agents">
                <label>Agentes</label>
                <div className="CardCreateCampain__content">
                    <label>
                        <input type="checkbox" checked/>
                        C. Torres
                    </label>
                    <label>
                        <input type="checkbox" checked/>
                        A. Bravo
                    </label>
                    <label>
                        <input type="checkbox" checked/>
                        P. Páez
                    </label>
                    <label>
                        <input type="checkbox" checked/>
                        R. Anon
                    </label>
                    <label>
                        <input type="checkbox" checked/>
                        M. Ester
                    </label>
                    <label>
                        <input type="checkbox" checked/>
                        P. Carrión
                    </label>
                </div>
            </div>

            <div className="CardCreateCampain__form">
                <label className="CardCreateCampain__select">
                    Empresa
                    <select>
                        <option>SEFIL 1</option>
                    </select>
                </label>

                <label className="CardCreateCampain__input">
                    Cargar datos
                    <input type="text"/>
                </label>

                <label className="CardCreateCampain__input">
                    Fecha de inicio
                    <input type="date"/>
                </label>
                
                <label className="CardCreateCampain__input">
                    Fecha de fin
                    <input type="date"/>
                </label>
            </div>

            <div className="CardCreateCampain__footer">
                <button className="CardCreateCampain__button CardCreateCampain__button--save">Guardar</button>
            </div>
        </div>
    );
}