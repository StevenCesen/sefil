import "./Credits.css";
import { useEffect } from "react";
import { useStoreLoader } from "../../stores/useStoreLoader";
import { useStoreFilterCredits } from "../../stores/useStoreCredits";
import FilterCredits from "../../components/Credits/FilterCredits/FilterCredits";
import { ExternalLink } from "lucide-react";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import { NavLink } from "react-router-dom";
import SearchVoucher from "../../components/Payments/SearchVoucher/SearchVoucher";
import NavigationToggle from "../../components/Tools/NavigationToggle/NavigationToggle";
import NavigationFooter from "../../components/Tools/NavigationFooter/NavigationFooter";

export default function Credits(){
    const loader = useStoreLoader();
    const credits= useStoreFilterCredits();

    const handleCredits = async () =>{
        loader.viewOn(true);
        await credits.filterCredits(credits.getFilterString());
        loader.viewOn(false);
    }

    const handleSetCredits = async (value) =>{
        await credits.setCredits(value);
    }

    useEffect(()=>{
        handleCredits()
    },[
        credits.sync_id,
        credits.client_name,
        credits.client_ci,
        credits.total_amount,
        credits.days_past_due_min,
        credits.days_past_due_max,
        credits.cartera,
        credits.total_fees,
        credits.agency,
        credits.provincia,
        credits.canton,
        credits.sync_status,
        credits.collection_state,
        credits.sync_status,
        credits.agent
    ]);

    return (
        <div className="Credits">
            <h2 className="Credits__title">Créditos</h2>
            <div className="Credits__head">
                <SearchVoucher/>
                <NavigationToggle
                    first_url   =   {credits.credits.first_page_url}
                    prev_url    =   {credits.credits.prev_page_url}
                    per_page    =   {10}
                    next_url    =   {credits.credits.next_page_url}
                    last_url    =   {credits.credits.last_page_url}
                    setData     =   {handleSetCredits}
                    filters     =   {credits.getFilterString()}
                />
            </div>
            
            <FilterCredits/>
            {
                credits.credits.data.map(credit=>(
                    <div key={credit.id} className="Credits__item">
                        <NavLink to={`/credits/${credit.id}?cartera=${credits.cartera}`}><ExternalLink size={30} color="white"/></NavLink>
                        <label>{credit.sync_id}</label>
                        <label>{credit.name}</label>
                        <label>{credit.ci}</label>
                        <label>{useFormatterNumber({value:credit.total_amount,currency:'USD'})}</label>
                        <label>{credit.days_past_due}</label>
                        <label>{credits.cartera}</label>
                        <label>{credit.agency}</label>
                        <label>{credit.total_fees}</label>
                        <label>{credit.provincia}</label>
                        <label>{credit.canton}</label>
                        <label>{credit.status}</label>
                        <label>{credit.collection_state}</label>
                        <label>{credit.agent_name}</label>
                    </div>
                ))
            }
            <NavigationFooter
                page={credits.credits.current_page}
                from={credits.credits.from}
                to={credits.credits.to}
                total={credits.credits.total}
            />
        </div>
    );
}