import CardStructure from "../CardStructure/CardStructure";
import "./CardActivity.css";
import ResumeCondonation from "../ResumeCondonation/ResumeCondonation";

export default function CardActivity({items,is_active}) {
    return (
        <div className="CardActivity">
            <h3>Actividad reciente</h3>
            {
                items.map((item)=>(
                    (item.type==='RESTRUCT')
                    ?   <CardStructure restruct={item} is_active={is_active}/>
                    :   <ResumeCondonation condonation={item}/>
                ))
            }
        </div>
    );
}