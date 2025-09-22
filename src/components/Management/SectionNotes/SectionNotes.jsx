import "./SectionNotes.css";

export default function SectionNotes({notes}){
    return (
        <div className="SectionNotes">
            <div className="SectionNotes__head">
                <label>Fecha</label>
                <label>Concepto</label>
                <label>Motivo</label>
            </div>
            {
                notes.map((note,index)=>(
                    <div className="SectionNotes__item">
                        <label>{note.fecha}</label>
                        <label>{note.concepto}</label>
                        <label>{note.motivo}</label>
                    </div>
                ))
            }
        </div>
    );
}