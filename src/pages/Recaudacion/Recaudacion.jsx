import { useEffect, useRef } from "react";
import "./Recaudacion.css";
import useFetch from "../../hooks/useFetch";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import { NavLink, useLocation } from "react-router-dom";
import { ExternalLink, X } from "lucide-react";
import { useStoreRecaudacion } from "../../stores/useStoreRecaudacion";
import SectionPayments from "../../components/Management/SectionPayments/SectionPayments";

const VOUCHER_SEARCH_TYPES = ['voucher_number', 'voucher_reference'];

export default function Recaudacion() {
    const { fetchWithAuth } = useFetch();
    const location = useLocation();
    const store = useStoreRecaudacion();
    const prevPathRef = useRef(null);

    const {
        searchType,
        searchValue,
        results,
        loading,
        searched,
        voucherResult,
        voucherLoading,
        showVoucherModal,
        setSearchType,
        setSearchValue,
        setResults,
        setLoading,
        setSearched,
        setVoucherResult,
        setVoucherLoading,
        setShowVoucherModal,
    } = store;

    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'superadmin' || userRole === 'admin';

    const isVoucherSearch = VOUCHER_SEARCH_TYPES.includes(searchType);

    const handleCreditSearch = async () => {
        setLoading(true);
        setSearched(true);

        try {
            let queryParam = "";
            switch (searchType) {
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

    const handleVoucherSearch = async () => {
        setVoucherLoading(true);
        try {
            const queryParam = searchType === 'voucher_number'
                ? `payment_number=${searchValue}`
                : `payment_reference=${searchValue}`;

            const response = await fetchWithAuth(
                `${import.meta.env.VITE_URL_BASE}/payments?${queryParam}`
            );
            const data = await response.json();

            // Normalizar respuesta a array de pagos  { code, message, result: [...] }
            let payments = [];
            if (Array.isArray(data)) {
                payments = data;
            } else if (data.result && Array.isArray(data.result)) {
                payments = data.result;
            } else if (data.data && Array.isArray(data.data)) {
                payments = data.data;
            } else if (data.result && data.result.data && Array.isArray(data.result.data)) {
                payments = data.result.data;
            }

            if (payments.length > 0) {
                const first = payments[0];
                const clientInfo = {
                    name: first.client_name || '',
                    ci: first.client_ci || '',
                    sync_id: first.sync_id || '',
                    campain_name: first.campain_name || '',
                    financial_institution: first.financial_institution || '',
                };
                setVoucherResult({
                    clientInfo,
                    payments: { data: payments },
                });
            } else {
                setVoucherResult(null);
            }
            setShowVoucherModal(true);
        } catch (error) {
            console.error("Error searching voucher:", error);
            setVoucherResult(null);
            setShowVoucherModal(true);
        } finally {
            setVoucherLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchValue.trim()) return;

        if (isVoucherSearch) {
            await handleVoucherSearch();
        } else {
            await handleCreditSearch();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleTypeChange = (type) => {
        setSearchType(type);
        setResults([]);
        setSearched(false);
        setVoucherResult(null);
        setShowVoucherModal(false);
    };

    useEffect(() => {
        const currentPath = location.pathname;
        const lastPath = prevPathRef.current;

        if (
            currentPath === '/recaudacion' &&
            lastPath &&
            lastPath !== '/recaudacion' &&
            !lastPath.startsWith('/recaudacion/')
        ) {
            store.clearSearch();
        }

        prevPathRef.current = currentPath;
    }, [location.pathname]);

    const placeholder =
        searchType === 'credit_number' ? 'Por Número de Crédito' :
        searchType === 'ci' ? 'Por Cédula' :
        searchType === 'name' ? 'Por Nombre' :
        searchType === 'voucher_number' ? 'Número de comprobante' :
        'Referencia del comprobante';

    const hasResults = searched && !isVoucherSearch;

    return (
        <div className="Recaudacion">
            <div className={`Recaudacion__search-container ${hasResults ? 'has-results' : ''}`}>
                <h2 className="Recaudacion__title">Recaudación</h2>

                <div className="Recaudacion__search-box">
                    <input
                        type="text"
                        className="Recaudacion__search-input"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="Recaudacion__search-button"
                        onClick={handleSearch}
                        disabled={loading || voucherLoading}
                    >
                        {(loading || voucherLoading) ? "Buscando..." : "Buscar"}
                    </button>
                </div>

                <div className="Recaudacion__radio-group">
                    <div className="Recaudacion__radio-block">
                        <span className="Recaudacion__radio-section-label">Por crédito</span>
                        <div className="Recaudacion__radio-options">
                            {[
                                { value: 'ci', label: 'Cédula' },
                                { value: 'name', label: 'Nombre' },
                                { value: 'credit_number', label: 'Número de crédito' },
                            ].map(({ value, label }) => (
                                <label key={value} className={`Recaudacion__radio-label ${searchType === value ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="searchType"
                                        value={value}
                                        checked={searchType === value}
                                        onChange={() => handleTypeChange(value)}
                                    />
                                    <span className="Recaudacion__radio-text">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <span className="Recaudacion__radio-divider" />

                    <div className="Recaudacion__radio-block">
                        <span className="Recaudacion__radio-section-label">Por comprobante</span>
                        <div className="Recaudacion__radio-options">
                            {[
                                { value: 'voucher_number', label: 'Número de comprobante' },
                                { value: 'voucher_reference', label: 'Referencia' },
                            ].map(({ value, label }) => (
                                <label key={value} className={`Recaudacion__radio-label ${searchType === value ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="searchType"
                                        value={value}
                                        checked={searchType === value}
                                        onChange={() => handleTypeChange(value)}
                                    />
                                    <span className="Recaudacion__radio-text">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resultados de búsqueda de créditos */}
            {searched && !isVoucherSearch && (
                <div className="Recaudacion__results">
                    {loading ? (
                        <div className="Recaudacion__loading">Buscando...</div>
                    ) : results.length > 0 ? (
                        <>
                            <div className="Recaudacion__results-header">
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
                                <div key={credit.id} className="Recaudacion__results-item">
                                    <NavLink to={`/recaudacion/credits/${credit.id}`}>
                                        <ExternalLink size={20} color="#2196f3" />
                                    </NavLink>
                                    <label>{credit.business_name}-{credit.sync_id}</label>
                                    <label>{credit.clients[0].name}</label>
                                    {
                                        (searchType === 'ci')
                                        ?
                                            <label>{
                                                (credit.clients[0].ci?.trim() === searchValue?.trim())
                                                    ?
                                                        <span>{`${credit.clients[0].ci}`} <strong> TITULAR </strong></span>
                                                    :   <span>{credit.clients[0].ci} <strong> GARANTE</strong></span>
                                            }</label>
                                        : <label>{credit.clients[0].ci}</label>
                                    }
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

                            <div className="Recaudacion__results-footer">
                                Mostrando {results.length} registro{results.length !== 1 ? 's' : ''}.
                            </div>
                        </>
                    ) : (
                        <div className="Recaudacion__no-results">
                            No se encontraron resultados para la búsqueda.
                        </div>
                    )}
                </div>
            )}

            {/* Modal de comprobante */}
            {showVoucherModal && (
                <VoucherModal
                    voucherResult={voucherResult}
                    isAdmin={isAdmin}
                    onClose={() => setShowVoucherModal(false)}
                />
            )}
        </div>
    );
}

function VoucherModal({ voucherResult, isAdmin, onClose }) {
    return (
        <div className="Recaudacion__modal-overlay" onClick={onClose}>
            <div className="Recaudacion__modal" onClick={(e) => e.stopPropagation()}>
                <button className="Recaudacion__modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <h3 className="Recaudacion__modal-title">Comprobante de pago</h3>

                {voucherResult ? (
                    <>
                        <div className="Recaudacion__modal-info">
                            <span><strong>Titular:</strong> {voucherResult.clientInfo.name}</span>
                            <span><strong>Cédula:</strong> {voucherResult.clientInfo.ci}</span>
                            {voucherResult.clientInfo.sync_id && (
                                <span><strong>N° Crédito:</strong> {voucherResult.clientInfo.sync_id}</span>
                            )}
                            {voucherResult.clientInfo.campain_name && (
                                <span><strong>Campaña:</strong> {voucherResult.clientInfo.campain_name}</span>
                            )}
                            {voucherResult.clientInfo.financial_institution && (
                                <span><strong>Institución:</strong> {voucherResult.clientInfo.financial_institution}</span>
                            )}
                        </div>

                        <SectionPayments
                            payments={voucherResult.payments}
                            credit={{
                                collection_state: '',
                                name: voucherResult.clientInfo.name,
                                ci: voucherResult.clientInfo.ci,
                                sync: voucherResult.clientInfo.sync_id,
                                codigo: voucherResult.clientInfo.sync_id,
                            }}
                            view_complete_info={isAdmin}
                            is_admin={isAdmin}
                            showActions={false}
                        />
                    </>
                ) : (
                    <div className="Recaudacion__no-results">
                        No se encontró ningún comprobante con ese valor.
                    </div>
                )}
            </div>
        </div>
    );
}
