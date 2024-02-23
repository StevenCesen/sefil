import "./CardDataShort.css";

export default function CardDataShort({title,subtitle,data,status}){
    return (
        <div className="CardDataShort">
            <div>
                <div>
                    <h4>{title}</h4>
                    {
                        (status) &&
                            <span>{status}</span>
                    }
                </div>
                <p>{subtitle}</p>
            </div>
            <h2>{data}</h2>
        </div>
    );
}