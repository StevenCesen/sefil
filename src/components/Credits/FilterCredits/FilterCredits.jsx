import { useEffect } from "react";
import { useStoreFilterCredits } from "../../../stores/useStoreCredits";
import "./FilterCredits.css";

export default function FilterCredits(){
    const filter_credits=useStoreFilterCredits();

    useEffect(()=>{
        filter_credits.getAgents();
    },[]);
    
    return(
        <div className="FilterCredits">
            <div>
            </div>
            
            <label className="FilterCredits__label">
                Crédito
                <input
                    onChange={(e)=>{
                        filter_credits.setSyncID(e.target.value);
                    }}
                    placeholder="Crédito"
                />
            </label>

            <label className="FilterCredits__label">
                Nombre
                <input
                    onChange={(e)=>{
                        filter_credits.setName(e.target.value);
                    }}
                    placeholder="Nombre del titular o garante"
                />
            </label>

            <label className="FilterCredits__label">
                Cédula
                <input
                    onChange={(e)=>{
                        filter_credits.setCI(e.target.value);
                    }}
                    placeholder="Cédula del titular o garante"
                />
            </label>

            <label className="FilterCredits__label">Monto</label>
            
            <div className="FilterCredits__range">
                <label>Días de mora</label>
                <div>
                    <label>
                        Min
                        <input 
                            type="text"
                            onChange={(e)=>{
                                filter_credits.setMinDays(e.target.value);
                            }}
                        />
                    </label>
                    <label>
                        Max
                        <input 
                            type="text"
                            onChange={(e)=>{
                                filter_credits.setMaxDays(e.target.value);
                            }}
                        />
                    </label>
                </div>
            </div>
            
            <label className="FilterCredits__label">
                Cartera
                <select
                    className="FilterCredits__select"
                    onChange={(e)=>{
                        filter_credits.setCartera(e.target.value);
                        filter_credits.getAgents();
                    }}
                >
                    <option value={''}>--Todos--</option>
                    <option value={"SEFIL_1"}>SEFIL-1</option>
                    <option value={"SEFIL_2"}>SEFIL-2</option>
                    <option value={"syncs"}>FACES</option>
                </select>
            </label>
                            
            <label>
                Agencia
                <select
                    className="FilterCredits__select"
                    onChange={(e)=>{
                        filter_credits.setAgency(e.target.value);
                    }}
                >
                    <option value={''}>--Todos--</option>
                    <option value={"catacocha"}>CATACOCHA</option>
                    <option value={"palanda"}>PALANDA</option>
                    <option value={"cariamanga"}>CARIAMANGA</option>
                    <option value={"zamora"}>ZAMORA</option>
                    <option value={"zumba"}>ZUMBA</option>
                    <option value={"piñas"}>PIÑAS</option>
                    <option value={"celica"}>CELICA</option>
                    <option value={"catamayo"}>CATAMAYO</option>
                    <option value={"malacatos"}>MALACATOS</option>
                    <option value={"santa rosa"}>SANTA ROSA</option>
                    <option value={"oficina las pitas"}>OFICINA LAS PITAS</option>
                    <option value={"oficina centro"}>OFICINA CENTRO</option>
                    <option value={"oficina norte"}>OFICINA NORTE</option>
                    <option value={"san miguel de los bancos"}>SAN MIGUEL DE LOS BANCOS</option>
                    <option value={"milagro"}>MILAGRO</option>
                    <option value={"santo domingo"}>SANTO DOMINGO</option>
                    <option value={"el carmen"}>EL CARMEN</option>
                    <option value={"cayambe"}>CAYAMBE</option>
                    <option value={"pasaje"}>PASAJE</option>
                    <option value={"tumbaco"}>TUMBACO</option>
                    <option value={"la troncal"}>LA TRONCAL</option>
                    <option value={"amaguaña"}>AMAGUAÑA</option>
                    <option value={"naranjal"}>NARANJAL</option>
                    <option value={"quinche"}>QUINCHE</option>
                    <option value={"quininde"}>QUININDE</option>
                </select>
            </label>

            <label className="FilterCredits__label">Cuotas</label>
            <label className="FilterCredits__label">
                Provincia
                <input
                    onChange={(e)=>{
                        filter_credits.setProvincia(e.target.value);
                    }}
                    placeholder="Provincia"
                />
            </label>
            <label className="FilterCredits__label">
                Canton
                <input
                    onChange={(e)=>{
                        filter_credits.setCanton(e.target.value);
                    }}
                    placeholder="Canton"
                />
            </label>
            <label className="FilterCredits__label">
                Estado campaña
                <select
                    className="FilterCredits__select"
                    onChange={(e)=>{
                        filter_credits.setSyncStatus(e.target.value);
                    }}
                >
                    <option value={''}>--Todos--</option>
                    <option value={"ACTIVE"}>ACTIVO</option>
                    <option value={"INACTIVE"}>INACTIVO</option>
                </select>
            </label>
            <label className="FilterCredits__label">
                Estado crédito
                <select
                    className="FilterCredits__select"
                    onChange={(e)=>{
                        filter_credits.setCollectionState(e.target.value);
                    }}
                >
                    <option value={''}>--Todos--</option>
                    <option value={"Vigente"}>Vigente</option>
                    <option value={"Vencido"}>Vencido</option>
                    <option value={"Vencido en tramite judicial"}>Vencido en tramite judicial</option>
                    <option value={"Castigadp"}>Castigado</option>
                    <option value={"Convenio de pago"}>Convenio de pago</option>
                    <option value={"Cancelado"}>Cancelado</option>
                </select>
            </label>
            <label className="FilterCredits__label">
                Agente
                <select
                    className="FilterCredits__select"
                    onChange={(e)=>{
                        filter_credits.setAgent(e.target.value);
                    }}
                >
                    <option value={''}>--Todos--</option>
                    {
                        filter_credits.agents.map(agent=>(
                            <option key={agent.name} value={agent.id}>{agent.name}</option>
                        ))
                    }
                </select>
            </label>
        </div>
    );
}