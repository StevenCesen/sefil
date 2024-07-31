import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import CardNewCampo from "../components/CardNewCampo/CardNewCampo";

export default function Template(){

    const param=useParams();
    const [data,setData]=useState();
    const [state,setState]=useState();
    const [view_new,setView]=useState(false);

    const addCampo=({type,name})=>{
        const new_campo={
            title:name,
            type_value:type,
            options:[]
        };

        const copy_structure=JSON.parse(data.structure);
        copy_structure.default.push(new_campo);

        setData({
            ...data,
            structure:JSON.stringify(copy_structure)
        });
    }

    useEffect(()=>{
        setView(false);
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/templates/${param.ci}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setData(data.date);
            });
        setState('');

    },[]);

    if(!data) return <></>

    return (
        <div className="pageConsulta">
            <div className="DetailCredit__head">
                <NavLink
                    to="" 
                    onClick={(e)=>{
                        e.preventDefault();
                        history.go(-1) 
                    }}
                >Regresar</NavLink>
            </div>

            <div className="Template">
                <div className="Templates__init">
                    <h4 className="Reports__title">Campos de la plantilla {param.ci}</h4>
                </div>
                
                <div className="Template__structure">
                    {
                        JSON.parse(data.structure).default.map((item,index)=>(
                            (item.type_value==='text')
                            ?
                                <label 
                                    className="Template__inputText"
                                    key={index}
                                >
                                    {item.title}
                                    <input placeholder="JUAN RIVAS" disabled/>
                                </label>

                            :   (item.type_value==='number')
                                ?
                                    <label 
                                        className="Template__inputText"
                                        key={index}
                                    >
                                        {item.title}
                                        <input type="number" placeholder="0.00" step={0.01}/>
                                    </label>
                                :
                                    (item.type_value==='select')
                                    ?
                                        <div
                                            className="Template__Select"
                                            key={index}
                                        >
                                            <div>
                                                {item.title}
                                                <button
                                                    onClick={(e)=>{
                                                        let new_value=e.target.parentElement.parentElement.children[e.target.parentElement.parentElement.children.length-1].value;
                                                        
                                                        const campo=item.title;

                                                        let copy=JSON.parse(data.structure);

                                                        copy.default.map((opt)=>{
                                                            if(opt.title===campo){
                                                                if('options' in opt){
                                                                    opt.options.push(new_value);
                                                                    copy.default.map((opt)=>{
                                                                        if('suboptions' in opt){
                                                                            opt.suboptions.push({
                                                                                title:new_value,
                                                                                options:[]
                                                                            });
                                                                        }
                                                                    })
                                                                }else{
                                                                    opt.suboptions.map((sub)=>{
                                                                        if(state===sub.title){
                                                                            sub.options.push(new_value);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });

                                                        e.target.parentElement.parentElement.children[e.target.parentElement.parentElement.children.length-1].value="";

                                                        setData({
                                                            ...data,
                                                            structure:JSON.stringify(copy)
                                                        });
                                                    }}
                                                >
                                                Nueva opción</button>
                                            </div>
                                            {
                                                ('options' in item) 
                                                ?
                                                    item.options.map((option,index)=>(
                                                        <label className={`${(state===option) && "option--check"}`}>
                                                            <input 
                                                                name="estado" 
                                                                value={option}
                                                                type="radio"
                                                                onChange={(e)=>{
                                                                    setState(e.target.value);
                                                                }}
                                                            />
                                                            {option}

                                                            <img 
                                                                className={`${(state===option) && "view--button"}`} 
                                                                src="./icons/tach.png"
                                                                onClick={(e)=>{
                                                                    let copy=JSON.parse(data.structure);

                                                                    copy.default.map((opti)=>{
                                                                        if(opti.title==='Estado'){
                                                                            const new_options=[];

                                                                            opti.options.map(option=>{
                                                                                if(option!==state){
                                                                                    new_options.push(option);
                                                                                }
                                                                            });

                                                                            opti.options=new_options;
                                                                        }

                                                                        if(opti.title==='Subestado'){
                                                                            const new_suboptions=[];
                                                                
                                                                            opti.suboptions.map((suboption)=>{
                                                                                if(suboption.title!==option){
                                                                                    new_suboptions.push(suboption);
                                                                                }
                                                                            })

                                                                            opti.suboptions=new_suboptions;
                                                                        }

                                                                    });

                                                                    setData({
                                                                        ...data,
                                                                        structure:JSON.stringify(copy)
                                                                    });

                                                                    //============= Aquí tenemos la data de estructura de subestado actualizado
                                                                    
                                                                }}
                                                            />
                                                        </label>
                                                    ))

                                                :   ('suboptions' in item)
                                                    ?
                                                        
                                                        item.suboptions.map((option,index)=>(
                                                            (state===option.title) && 
                                                                option.options.map((opt,ind)=>(
                                                                    <label>
                                                                        <span value={opt}>{opt}</span>

                                                                        <img 
                                                                            className="view--subbutton" 
                                                                            src="./icons/tash2.png"
                                                                            onClick={(e)=>{
                                                                                let copy=JSON.parse(data.structure);

                                                                                copy.default.map((opti)=>{
                                                                                    if(opti.title==='Subestado'){
                                                                                    
                                                                                        opti.suboptions.map(suboption=>{
                                                                                            const new_options=[];

                                                                                            if(suboption.title===state){
                                                                                                suboption.options.map((val_op)=>{
                                                                                                    if(val_op!==opt){
                                                                                                        new_options.push(val_op)
                                                                                                    }
                                                                                                });

                                                                                                suboption.options=new_options;
                                                                                            }

                                                                                            

                                                                                            setData({
                                                                                                ...data,
                                                                                                structure:JSON.stringify(copy)
                                                                                            });

                                                                                        })
                                                                                    }
                                                                                });

                                                                                //============= Aquí tenemos la data de estructura de subestado actualizado
                                                                                
                                                                            }}
                                                                        />
                                                                    </label>
                                                                ))
                                                        ))

                                                    :   <></>
                                            
                                            }
                                            
                                            <input type="text" placeholder="Escribe aquí..."/>

                                        </div>
                                    :   (item.type_value==='date')
                                        ?   
                                            <label
                                                className="Template__inputText"
                                                key={index}
                                            >
                                                {item.title}
                                                <input type="date"/>
                                            </label>
                                        :   (item.type_value==='textarea')
                                            ?
                                                <label
                                                    className="Template__inputText"
                                                    key={index}
                                                >
                                                    {item.title}
                                                    <textarea placeholder="Escribe aquí"></textarea>
                                                </label>
                                            :   <></>
                        ))
                    }
                </div>

                <div className="Template__buttons">
                    <button
                        className="Template__button"
                        onClick={(e)=>{
                            e.target.textContent="Guardando...";

                            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/templates/${param.ci}`,{
                                method:'PUT',
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                },
                                body:new URLSearchParams({structure:data.structure})
                            })
                                .then((response) => response.json())  
                                .then((data) => {
                                    if(data.state===200){
                                        e.target.textContent="Guardado";
                                    }else{
                                        e.target.textContent="Inténtalo de nuevo"
                                    }
                                });
                        }}
                    >Guardar cambios</button>
                    
                    <button
                        onClick={(e)=>{
                            setView(true);
                        }}
                        className="Template__button Template__button--secondary"
                    >
                        Agregar nuevo campo
                    </button>
                </div>

                {/* SI ALCANZA EL TIEMPO SE HACE ESTO, SINO, NO */}
                {/* <div className="Templates__init">
                    <h4 className="Reports__title">Aspecto visual de la plantilla</h4>
                </div> */}

            </div>

            {
                (view_new)
                ?
                    <div className="CardPay">
                        <button 
                            className="CardCondonacion__close" 
                            onClick={()=>{
                                setView(false);
                            }}
                        >
                            Volver
                        </button>
                        <CardNewCampo
                            setCampo={addCampo}
                        />
                    </div>
                :   <></>
            }
            
        </div>
    );
}