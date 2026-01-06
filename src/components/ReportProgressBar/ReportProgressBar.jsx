import "./ReportProgressBar.css";

export default function ReportProgressBar({ progress }) {
    if (progress <= 0) return null;

    return (
        <div className="ReportProgressBar">
            <div className="ReportProgressBar__container">
                <div
                    className="ReportProgressBar__fill"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="ReportProgressBar__text">
                {progress < 100 ? 'Generando reporte...' : 'Descarga completada'} {progress}%
            </p>
        </div>
    );
}
