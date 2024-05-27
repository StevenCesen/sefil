
import "./FilterRange.css";

export default function FilterRange({title}){
    return (
        <div className="FilterRange">
            <span>{title}</span>
            <div>
                <label>
                    min
                    <input type="number"/>
                </label>
                <label>
                    max
                    <input type="number"/>
                </label>
            </div>
        </div>
    );
}