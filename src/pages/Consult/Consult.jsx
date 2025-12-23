import { useState } from "react";
import "./Consult.css";
import useFetch from "../../hooks/useFetch";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import { NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function Consult() {
    const { fetchWithAuth } = useFetch();
    const [searchType, setSearchType] = useState("credit_number");
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            let queryParam = "";
            switch(searchType) {
                case "credit_number":
                    queryParam = `sync_id=${searchValue}`;
                    break;
                case "ci":
                    queryParam = `client_ci=${searchValue}`;
                    break;
                case "name":
                    queryParam = `client_name=${searchValue}`;
                    break;
                default:
                    queryParam = `sync_id=${searchValue}`;
            }

            const response = await fetchWithAuth(
                `${import.meta.env.VITE_URL_BASE}/credits?per_page=15&${queryParam}`
            );
            const data = await response.json();

            if (data.result && data.result.data && Array.isArray(data.result.data)) {
                setResults(data.result.data);
            } else if (Array.isArray(data)) {
                setResults(data);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Error searching credits:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="Consult">
            <div className={`Consult__search-container ${searched ? 'has-results' : ''}`}>
                <h2 className="Consult__title">Consulta de créditos</h2>

                <div className="Consult__search-box">
                    <input
                        type="text"
                        className="Consult__search-input"
                        placeholder={
                            searchType === "credit_number" ? "Por Número de Crédito" :
                            searchType === "ci" ? "Por Cédula" :
                            "Por Nombre"
                        }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="Consult__search-button"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "Buscando..." : "Buscar"}
                    </button>
                </div>

                <div className="Consult__radio-group">
                    <label className={`Consult__radio-label ${searchType === 'ci' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="searchType"
                            value="ci"
                            checked={searchType === 'ci'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span className="Consult__radio-text">Por Cédula</span>
                    </label>

                    <label className={`Consult__radio-label ${searchType === 'name' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="searchType"
                            value="name"
                            checked={searchType === 'name'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span className="Consult__radio-text">Por Nombre</span>
                    </label>

                    <label className={`Consult__radio-label ${searchType === 'credit_number' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="searchType"
                            value="credit_number"
                            checked={searchType === 'credit_number'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span className="Consult__radio-text">Por Número de Crédito</span>
                    </label>
                </div>
            </div>

            {searched && (
                <div className="Consult__results">
                    {loading ? (
                        <div className="Consult__loading">Buscando...</div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="Consult__results-header">
                                <label></label>
                                <label>Crédito</label>
                                <label>Nombre</label>
                                <label>Cédula del titular</label>
                                <label>Monto</label>
                                <label>Días de mora</label>
                                <label>Cartera</label>
                                <label>Agencia</label>
                                <label>Cuotas</label>
                                <label>Provincia</label>
                                <label>Canton</label>
                                <label>Estado campaña</label>
                                <label>Estado crédito</label>
                                <label>Agente</label>
                            </div>

                            {results.map((credit) => (
                                <div key={credit.id} className="Consult__results-item">
                                    <NavLink to={`/credits/${credit.id}`}>
                                        <ExternalLink size={20} color="#007bff" />
                                    </NavLink>
                                    <label>{credit.sync_id || credit.credit_number}</label>
                                    <label>{credit.clients[0].name}</label>
                                    <label>{credit.clients[0].ci}</label>
                                    <label>{useFormatterNumber({ value: credit.total_amount, currency: 'USD' })}</label>
                                    <label>{credit.days_past_due}</label>
                                    <label>{credit.business_name}</label>
                                    <label>{credit.agency}</label>
                                    <label>{credit.total_fees}</label>
                                    <label>{credit.province}</label>
                                    <label>{credit.canton}</label>
                                    <label>{credit.status || credit.sync_status}</label>
                                    <label>{credit.collection_state}</label>
                                    <label>{credit.agent_name}</label>
                                </div>
                            ))}

                            <div className="Consult__results-footer">
                                Mostrando {results.length} registro{results.length !== 1 ? 's' : ''}.
                            </div>
                        </>
                    ) : (
                        <div className="Consult__no-results">
                            No se encontraron resultados para la búsqueda.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
