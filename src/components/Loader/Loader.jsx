import { useStoreLoader } from "../../stores/useStoreLoader";
import "./loader.css";

export default function Loader(){

    const loader = useStoreLoader();

    if(!loader.isViewOn) return <></>

    return (
        <div className="ContentLoader">
            <span className="loader"></span>
        </div>
    );
}