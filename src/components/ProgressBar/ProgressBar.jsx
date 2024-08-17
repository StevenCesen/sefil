import "./ProgressBar.css";

export default function ProgressBar({val_porcentual}){
    return (
        <div className="ProgressBar">
            <span style={{width:`${val_porcentual}%`}}>{val_porcentual} %</span>
        </div>
    );
}