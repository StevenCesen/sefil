import { useState } from "react";
import "./Contacts.css";
import useFetch from "../../hooks/useFetch";
import { NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function Contacts() {
    const { fetchWithAuth } = useFetch();
    const [searchType, setSearchType] = useState("name");
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
            // Construir parámetros de búsqueda según el tipo
            let queryParam = "";
            switch(searchType) {
                case "name":
                    queryParam = `client_name=${searchValue}`;
                    break;
                case "ci":
                    queryParam = `client_ci=${searchValue}`;
                    break;
                case "phone":
                    queryParam = `phone_number=${searchValue}`;
                    break;
                default:
                    queryParam = `client_name=${searchValue}`;
            }

            const response = await fetchWithAuth(
                `${import.meta.env.VITE_URL_BASE}/contacts?per_page=15&${queryParam}`
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
            console.error("Error searching contacts:", error);
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
        <div className="Contacts">
            <div className={`Contacts__search-container ${searched ? 'has-results' : ''}`}>
                <h2 className="Contacts__title">Consulta de contactos</h2>

                <div className="Contacts__search-box">
                    <input
                        type="text"
                        className="Contacts__search-input"
                        placeholder={
                            searchType === "name" ? "Por Nombre" :
                            searchType === "ci" ? "Por Cédula" :
                            "Por Teléfono"
                        }
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="Contacts__search-button"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "Buscando..." : "Buscar"}
                    </button>
                </div>

                <div className="Contacts__radio-group">
                    <label className={`Contacts__radio-label ${searchType === 'name' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="searchType"
                            value="name"
                            checked={searchType === 'name'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span className="Contacts__radio-text">Por Nombre</span>
                    </label>

                    <label className={`Contacts__radio-label ${searchType === 'ci' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="searchType"
                            value="ci"
                            checked={searchType === 'ci'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span className="Contacts__radio-text">Por Cédula</span>
                    </label>

                    <label className={`Contacts__radio-label ${searchType === 'phone' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="searchType"
                            value="phone"
                            checked={searchType === 'phone'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span className="Contacts__radio-text">Por Teléfono</span>
                    </label>
                </div>
            </div>

            {
                console.log(results)
            }
            
            {searched && (
                <div className="Contacts__results">
                    {loading ? (
                        <div className="Contacts__loading">Buscando...</div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="Contacts__results-header">
                                <label>Nombre</label>
                                <label>Cédula</label>
                                <label>Teléfono</label>
                                <label>Tipo</label>
                                <label>Crédito</label>
                                <label>Estado</label>
                            </div>

                            {results.map((contact) => (
                                <div key={contact.id} className="Contacts__results-item">
                                    <label>{contact.client_name}</label>
                                    <label>{contact.client_ci}</label>
                                    <label>{contact.phone_number} - {contact.is_external ? "Fuente FACES" : "Fuente SEFIL"}</label>
                                    <label>{contact.phone_type || '-'}</label>
                                    <label>{contact.credit_number || contact.sync_id}</label>
                                    <label>{(contact.phone_status==='ACTIVE') ? "ACTIVO" : "INACTIVO"}</label>
                                </div>
                            ))}

                            <div className="Contacts__results-footer">
                                Mostrando {results.length} registro{results.length !== 1 ? 's' : ''}.
                            </div>
                        </>
                    ) : (
                        <div className="Contacts__no-results">
                            No se encontraron resultados para la búsqueda.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}