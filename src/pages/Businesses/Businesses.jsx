import { useEffect, useState } from "react";
import "./Businesses.css";
import CardCreateBusiness from "../../components/CardCreateBusiness/CardCreateBusiness";
import CardListBusiness from "../../components/CardListBusiness/CardListBusiness";
import CardPrelacion from "../../components/CardPrelacion/CardPrelacion";
import BackButton from "../../components/BackButton/BackButton";
import Loader from "../../components/Loader/loader";
import useFetch from "../../hooks/useFetch";

export default function Businesses() {
    const { fetchWithAuth } = useFetch();
    const [businesses, setBusinesses] = useState([]);
    const [viewPrelacion, setViewPrelacion] = useState(false);
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadBusinesses = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/businesses`);
            const data = await response.json();

            if (data.code === 1 && data.result) {
                setBusinesses(data.result.data || []);
            } else {
                setBusinesses([]);
            }
        } catch (error) {
            console.error('Error loading businesses:', error);
            setBusinesses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBusinesses();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="Businesses">
            <BackButton />

            <div className="Businesses__header">
                <div className="Businesses__headerInfo">
                    <h2>Carteras cargadas</h2>
                    <p>Formato de archivo .xlsx (EXCEL)</p>
                </div>
                <CardCreateBusiness onBusinessCreated={loadBusinesses} />
            </div>

            <div className="Businesses__tableHeader">
                <span>Cartera</span>
                <span>Subida</span>
                <span>Última actualización</span>
                <span>Estado</span>
                <span>Prelación</span>
            </div>

            <div className="Businesses__list">
                {businesses.length > 0 ? (
                    businesses.map((business) => (
                        <CardListBusiness
                            key={business.id}
                            business={business}
                            onViewPrelacion={() => {
                                setCurrentBusiness(business);
                                setViewPrelacion(true);
                            }}
                            onBusinessUpdated={loadBusinesses}
                        />
                    ))
                ) : (
                    <div className="Businesses__empty">
                        <p>No hay carteras cargadas</p>
                    </div>
                )}
            </div>

            {viewPrelacion && currentBusiness && (
                <div className="Businesses__prelacionModal">
                    <div className="Businesses__prelacionOverlay" onClick={() => setViewPrelacion(false)} />
                    <div className="Businesses__prelacionContent">
                        <CardPrelacion
                            cartera={currentBusiness}
                            onClose={() => setViewPrelacion(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
