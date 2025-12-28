import './CardListBusiness.css';

export default function CardListBusiness({ business, onViewPrelacion }) {
    return (
        <div className="CardListBusiness">
            <div className="CardListBusiness__item">
                <p>{business.name}</p>
            </div>
            <div className="CardListBusiness__item">
                <p>{business.created_at?.substr(0, 10)}</p>
            </div>
            <div className="CardListBusiness__item">
                <p>{business.updated_at?.substr(0, 10) || business.last_update}</p>
            </div>
            <div className="CardListBusiness__item">
                <p>{business.status}</p>
            </div>
            <div className="CardListBusiness__item">
                <button
                    className="CardListBusiness__prelacionBtn"
                    onClick={onViewPrelacion}
                >
                    Orden de prelación
                </button>
            </div>
        </div>
    );
}