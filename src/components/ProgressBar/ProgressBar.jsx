import "./ProgressBar.css";

export default function ProgressBar({val_porcentual, isInfinite = false}){
    if (isInfinite) {
        return (
            <div className="ProgressBar">
                <span className="ProgressBar__infinite"></span>
            </div>
        );
    }

    return (
        <div className="ProgressBar">
            <span style={{width:`${val_porcentual}%`}}>{val_porcentual} %</span>
        </div>
    );
}