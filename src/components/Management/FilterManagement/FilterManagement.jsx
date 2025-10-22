import { useEffect } from "react";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";
import "./FilterManagement.css";

export default function FilterManagement(){

    const filter_management=useStoreFilterManagement();    
    
    return(
        <div className="FilterManagement">
            <div>
            </div>
            
            <label className="FilterManagement__label">
                Nombre
                <input
                    onChange={(e)=>{
                        if(e.target.value.length>=4){
                            filter_management.setName(e.target.value);
                        }else{
                            filter_management.setName(' ');
                        }
                        filter_management.FilteredCredits(filter_management.getFilterString());
                    }}
                    placeholder="Nombre o crédito"
                />
            </label>

            <label className="FilterManagement__label">
                Cédula
                <input
                    onChange={(e)=>{
                        if(e.target.value.length>=4){
                            filter_management.setCi(e.target.value);
                        }else{
                            filter_management.setCi('');
                            
                        }
                        filter_management.FilteredCredits(filter_management.getFilterString());
                    }}
                    placeholder="Cédula"
                />
            </label>

            <label className="FilterManagement__label">
                Agencia
                <select
                    onChange={(e)=>{
                        filter_management.setAgency(e.target.value);
                        filter_management.FilteredCredits(filter_management.getFilterString());
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

            <div className="FilterManagement__range">
                <label>Días de mora</label>
                <div>
                    <label>
                        Min
                        <input 
                            type="text"
                            onChange={(e)=>{
                                filter_management.setMinDays(e.target.value);
                                filter_management.FilteredCredits(filter_management.getFilterString());
                            }}
                        />
                    </label>
                    <label>
                        Max
                        <input 
                            type="text"
                            onChange={(e)=>{
                                filter_management.setMaxDays(e.target.value);
                                filter_management.FilteredCredits(filter_management.getFilterString());
                            }}
                        />
                    </label>
                </div>
            </div>
            
            <label className="FilterManagement__label">
                Sector Econ.
                <select
                    onChange={(e)=>{
                        filter_management.setSector(e.target.value);
                        filter_management.FilteredCredits(filter_management.getFilterString());
                    }}
                >
                    <option value={""}>-- Seleccionar --</option>
                    <option value={"AGRÍCOLA"}>AGRÍCOLA</option>
                    <option value={"COMERCIO"}>COMERCIO</option>
                    <option value={"PECUARIA"}>PECUARIA</option>
                    <option value={"PESCA"}>PESCA</option>
                    <option value={"SERVICIOS"}>SERVICIOS</option>
                    <option value={"TRANSFORMACION"}>TRANSFORMACION</option>
                </select>
            </label>

            <label className="FilterManagement__label">Monto</label>

            <label className="FilterManagement__label">Cuotas</label>

            <label className="FilterManagement__label">
                Estado gestión
                <select
                    onChange={(e)=>{
                        filter_management.setManagementState(e.target.value);
                        filter_management.FilteredCredits(filter_management.getFilterString());
                    }}
                >
                    <option value={""}>-- Seleccionar --</option>
                    <option value={"PENDIENTE"}>PENDIENTE</option>
                    <option value={"OFERTA DE PAGO"}>OFERTA DE PAGO</option>
                    <option value={"REGESTION DE OFERTA"}>REGESTION DE OFERTA</option>
                    <option value={"VISITA CAMPO"}>VISITA CAMPO</option>
                    <option value={"COMPROMISO DE PAGO"}>COMPROMISO DE PAGO</option>
                    <option value={"MENSAJE A TERCEROS"}>MENSAJE A TERCEROS</option>
                    <option value={"MENSAJE EN BUZÓN DEL CLIENTE"}>MENSAJE EN BUZÓN DEL CLIENTE</option>
                    <option value={"YA PAGÓ"}>YA PAGÓ</option>
                    <option value={"MENSAJE DE TEXTO"}>MENSAJE DE TEXTO</option>
                    <option value={"NO CONTESTA"}>NO CONTESTA</option>
                    <option value={"SOLICITA REFINANCIAMIENTO"}>SOLICITA REFINANCIAMIENTO</option>
                    <option value={"NUMERO INCORRECTO"}>NUMERO INCORRECTO</option>
                    <option value={"FUERA DEL AREA DE COBERTURA"}>FUERA DEL AREA DE COBERTURA</option>
                    <option value={"SUSPENDIDO POR FALTA DE PAGO"}>SUSPENDIDO POR FALTA DE PAGO</option>
                    <option value={"CLIENTE SE NIEGA A PAGAR"}>CLIENTE SE NIEGA A PAGAR</option>
                    <option value="CLIENTE INDICA QUE NO ES SU DEUDA">CLIENTE INDICA QUE NO ES SU DEUDA</option>
                    <option value="PASAR A TRAMITE LEGAL">PASAR A TRAMITE LEGAL</option>
                    <option value="VOLVER A LLAMAR">VOLVER A LLAMAR</option>
                    <option value="CONVENIO DE PAGO">CONVENIO DE PAGO</option>
                    <option value="CONTACTO INDICA QUE ESTA EQUIVOCADO">CONTACTO INDICA QUE ESTA EQUIVOCADO</option>
                    <option value="CLIENTE ESCUCHA Y NO HABLA">CLIENTE ESCUCHA Y NO HABLA</option>
                    <option value="CLIENTE ESTA OCUPADO">CLIENTE ESTA OCUPADO</option>
                    <option value="CONTESTA MENOR DE EDAD">CONTESTA MENOR DE EDAD</option>
                    <option value="CORTA LA LLAMADA">CORTA LA LLAMADA</option>
                    <option value="INUBICABLE">INUBICABLE</option>
                    <option value="NO VIVE EN LA MISMA DIRECCIÓN">NO VIVE EN LA MISMA DIRECCIÓN</option>
                </select>
            </label>

            <label className="FilterManagement__label">
                Compromiso
                <input
                    type="date"
                    onChange={(e)=>{
                        filter_management.setPromiseDate(e.target.value);
                        filter_management.FilteredCredits(filter_management.getFilterString());
                    }}
                />
            </label>
        </div>
    );
}