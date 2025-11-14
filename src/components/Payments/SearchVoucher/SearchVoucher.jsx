import { useState } from "react";
import "./SearchVoucher.css";
import searchPayment from "../../../helpers/Payments/searchPayment";
import { NavLink } from "react-router-dom";

export default function SearchVoucher(){
    const [view_menu,setViewMenu] = useState(false);
    const [payment,setPayment] = useState(null);
    const [filter,setFilter]=useState({
        search_by:'REF',
        value:''
    });
    
    const handleSearch = async ({value,search_by}) =>{
        if(value.length===0){
            setPayment([]);
            setViewMenu(false);
            return;
        }

        const payment = await searchPayment({
            value,
            search_by
        });

        console.log(payment);

        setPayment(payment.data);
        setViewMenu(true);
    }

    return (
        <div className="SearchVoucher">
            <div className="SearchVoucher__head">
                <label className="SearchVoucher__label">
                    Buscar comprobante
                    <input 
                        type="search" 
                        placeholder="Referencia o número de comprobante"
                        value={filter.value}
                        onChange={(e)=>{
                            setFilter({
                                ...filter,
                                value:e.target.value
                            });

                            handleSearch({
                                value:e.target.value,
                                search_by:filter.search_by
                            });
                        }}
                    />
                </label>
                <label className="SearchVoucher__select">
                    Buscar por
                    <select
                        value={filter.search_by}
                        onChange={(e)=>{
                            setFilter({
                                ...filter,
                                search_by:e.target.value
                            });

                            handleSearch({
                                value:filter.value,
                                search_by:e.target.value
                            });
                        }}
                    >
                        <option value={"REF"}>Referencia</option>
                        <option value={"NRO"}>Número comprobante</option>
                    </select>
                </label>
            </div>
            {
                (view_menu)
                ?   
                    (payment && 'ci' in payment)
                    ?
                        <div className="SearchVoucher__menu">
                            <NavLink target="_self" to={`/credits/payments/${payment.credito}?cartera=${payment.cartera}&name=${payment.name}&ci=${payment.ci}`}>{payment.name} | {payment.institucion_financiera}</NavLink>
                        </div>
                    :
                        <div className="SearchVoucher__menu">
                            <p>No hay coincidencias</p>
                        </div>
                :   <></>
            }
        </div>
    );
}