import "./index.css";

export default function HeaderCRM({title,button_1,button_2}){
    return (
        <div className="HeaderCRM">
            <h3>{title}</h3>
            <div className="HeaderCRM__actions">

                <div className="HeaderCRM__dropDown">
                    <button>
                        <img src="./icons/material-symbols-light_edit-square-outline.png" title="Nuevo mensaje"/>
                    </button>
                    <div className="HeaderCRM__contentContacts">

                    </div>
                </div>
                <div className="HeaderCRM__dropDown">
                    <button>
                        <img src="./icons/ion_filter.png" title="Filtrar mensajes"/>
                    </button>
                    <div className="HeaderCRM__contentContacts">
                        
                    </div>
                </div>


            </div>
        </div>  
    );
}