import "./CardDiscuss.css";

export default function CardDiscuss({image,name,messages}){
    return (
        <div className="CardDiscuss">
            <div className="CardDiscuss__head">
                <div>
                    <img src={image}/>
                    <p>{name}</p>
                </div>
                <div>
                    <button>PDF</button>
                    <button>
                        <img src="./icons/search.png"/>
                    </button>
                </div>
            </div>

            <div className="CardDiscuss__messages">
                
            </div>

            <div className="CardDiscuss__box">
                <div className="CardDiscuss__actions">
                    <img src="./icons/ri_eye-off-fill.png"/>
                    <img src="./icons/simple-line-icons_paper-clip.png"/>
                </div>
                <textarea className="CardDiscuss__message" placeholder="Escribe un mensaje">

                </textarea>
                <button className="CardDiscuss__send">
                    <img
                        src="./icons/iconoir_send-solid.png"
                    />
                </button>
            </div>
        </div>
    );
}