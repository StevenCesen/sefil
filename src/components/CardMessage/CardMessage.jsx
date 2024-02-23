import "./CardMessage.css";

export default function CardMessage({image,name,message,fecha}){
    return (
        <div className="CardMessage">
            <img src={image}/>
            <div>
                <p>{name}</p>
                <label>{message}</label>
            </div>
            <p>{fecha}</p>
        </div>
    );
}