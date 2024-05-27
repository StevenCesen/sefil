import "./CardDataStatics.css";

export default function CardDataStatics({data}){
    return (
        <div className="CardDataStatics">
            <div>
                {
                    data.map((item,index)=>(
                        <div key={index}>
                            <h4>{item.title}</h4>
                            <p>{item.num}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}