import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";
import { useStoreLoader } from "../../../stores/useStoreLoader";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./SelectCampain.css";

export default function SelectNameCampain(){

    const filter_management=useStoreFilterManagement();
    const store_management=useStoreManagement();
    const loader = useStoreLoader();

    return(
        <label className="SelectCampain">
            Campaña
            <select
                onChange={(e)=>{
                    loader.viewOn(true);
                    filter_management.setBusiness(e.target.value);
                    filter_management.FilteredCredits(filter_management.getFilterString());
                    filter_management.numberTrays();
                    store_management.setIDCampain(e.target.value);
                    loader.viewOn(false);
                }}
            >
                <option value={''}>-- Seleccionar --</option>
                <option value={'SEFIL_1'}>SEFIL 1</option>
                <option value={'SEFIL_2'}>SEFIL 2</option>
                <option value={'syncs'}>FACES</option>
                <option value={'legal'}>LEGAL</option>
            </select>
        </label>
    );
}