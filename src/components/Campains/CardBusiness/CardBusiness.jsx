import "./CardBusiness.css";

export default function CardBusiness({business_name}){
    return (
        <div className={`CardBusiness ${(business_name!=='FACES') ? "CardBusiness--self" : "CardBusiness--others"}`}>
            <h3>Empresa: {business_name}</h3>
        </div>
    );
}