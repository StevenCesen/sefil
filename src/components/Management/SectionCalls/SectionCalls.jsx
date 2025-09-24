export default function SectionCalls({calls}){
    return(
        <div>
            {
                calls.map((call,index)=>(
                    <div key={index} className="CardCurrentGestion__item">
                        <label>{call.fecha}</label>
                        <label>{call.duration_call} seg.</label>
                        <label>{data.client_name}</label>
                        <label>{call.phone}</label>
                        <label>{call.state_call}</label>
                        {/* <ReactAudioPlayer
                            style={{width:"100%"}}
                            src={`https://core.sefil.com.ec/api/public/files/audios/${call.id_record}`}
                            controls
                        /> */}
                        <audio controls style={{width:"100%"}} src={`./api/public/files/audios/${call.id_record}`}></audio>
                    </div>
                ))
            }
        </div>
    );
}