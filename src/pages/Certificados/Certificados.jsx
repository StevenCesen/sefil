import { useEffect, useState } from "react";
import "./Certificados.css";
import useFetch from "../../hooks/useFetch";
import useFormatterNumber from "../../hooks/useFormatterNumber";
import sendpush from "../../helpers/sendpush";
import { Download, FileText, X } from "lucide-react";

const downloadBlob = (blob, contentType, fallbackName) => {
    const ext  = contentType === "application/zip" ? "zip" : "pdf";
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${fallbackName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
};

export default function Certificados() {
    const { fetchWithAuth } = useFetch();
    const [activeTab, setActiveTab] = useState("emitir");

    // ── búsqueda ────────────────────────────────────────────────────────────
    const [searchType,  setSearchType]  = useState("credit_number");
    const [searchValue, setSearchValue] = useState("");
    const [searching,   setSearching]   = useState(false);
    const [results,     setResults]     = useState([]);
    const [searched,    setSearched]    = useState(false);

    // ── crédito seleccionado ────────────────────────────────────────────────
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [types,          setTypes]          = useState([]);
    const [generating,     setGenerating]     = useState(false);

    // ── historial ───────────────────────────────────────────────────────────
    const [history,     setHistory]     = useState([]);
    const [historyMeta, setHistoryMeta] = useState(null);
    const [historyPage, setHistoryPage] = useState(1);
    const [loadingHist, setLoadingHist] = useState(false);
    const [issuedFrom,  setIssuedFrom]  = useState("");
    const [issuedTo,    setIssuedTo]    = useState("");
    const [downloading, setDownloading] = useState({});

    // ── helpers ─────────────────────────────────────────────────────────────
    const buildSearchQuery = () => {
        if (searchType === "credit_number") return `sync_id=${encodeURIComponent(searchValue)}`;
        if (searchType === "ci")            return `client_ci=${encodeURIComponent(searchValue)}`;
        return                                     `client_name=${encodeURIComponent(searchValue)}`;
    };

    const availableTypes = (credit) => {
        if (!credit?.clients) return [];
        const out = [];
        if (credit.clients.some((c) => c.type === "TITULAR")) out.push("TITULAR");
        if (credit.clients.some((c) => c.type === "GARANTE")) out.push("GARANTE");
        return out;
    };

    // ── búsqueda ─────────────────────────────────────────────────────────────
    const handleSearch = async () => {
        if (!searchValue.trim()) return;
        setSearching(true);
        setSearched(true);
        setResults([]);
        setSelectedCredit(null);
        setTypes([]);
        try {
            const res  = await fetchWithAuth(
                `${import.meta.env.VITE_URL_BASE}/credits?per_page=15&${buildSearchQuery()}`
            );
            const data = await res.json();
            const list = data?.result?.data ?? data?.data ?? (Array.isArray(data) ? data : []);
            setResults(list);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

    const handleTypeChange = (type) => {
        setSearchType(type);
        setResults([]);
        setSearched(false);
    };

    // ── selección de crédito ──────────────────────────────────────────────
    const selectCredit = (credit) => {
        setSelectedCredit(credit);
        setResults([]);
        setSearched(false);
        setSearchValue("");
        const avail = availableTypes(credit);
        setTypes(avail.length === 1 ? avail : []);
    };

    const toggleType = (t) =>
        setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

    // ── generar certificado ───────────────────────────────────────────────
    const handleGenerate = async () => {
        if (!selectedCredit || types.length === 0) {
            sendpush({ title: "Atención", message: "Seleccione al menos un tipo de persona", type: "Push--warning", timeout: 3000 });
            return;
        }
        setGenerating(true);
        try {
            const token = localStorage.getItem("token");
            const res   = await fetch(`${import.meta.env.VITE_URL_BASE}/certificates/no-deuda`, {
                method:  "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type":  "application/json",
                    "Accept":        "application/json, application/pdf, application/zip",
                },
                body: JSON.stringify({ credit_id: selectedCredit.id, types }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                sendpush({ title: "Error", message: err.message ?? "No se pudo generar el certificado", type: "Push--danger", timeout: 4000 });
                return;
            }

            const contentType = res.headers.get("Content-Type") ?? "";
            const blob        = await res.blob();
            downloadBlob(blob, contentType, `certificado_${selectedCredit.sync_id}`);
            sendpush({ title: "Certificado generado", message: "El archivo se descargó correctamente", type: "Push--sucessful", timeout: 3000 });
            setSelectedCredit(null);
            setTypes([]);
            fetchHistory(1);
        } catch {
            sendpush({ title: "Error", message: "Error al generar el certificado", type: "Push--danger", timeout: 4000 });
        } finally {
            setGenerating(false);
        }
    };

    // ── historial ─────────────────────────────────────────────────────────
    const fetchHistory = async (page = 1) => {
        setLoadingHist(true);
        try {
            let url = `${import.meta.env.VITE_URL_BASE}/certificates?page=${page}&per_page=15`;
            if (issuedFrom) url += `&issued_from=${issuedFrom}`;
            if (issuedTo)   url += `&issued_to=${issuedTo}`;
            const res  = await fetchWithAuth(url);
            const data = await res.json();
            if (data.code === 1) {
                setHistory(data.result?.data ?? []);
                setHistoryMeta(data.result?.meta ?? null);
                setHistoryPage(page);
            }
        } catch {
            setHistory([]);
        } finally {
            setLoadingHist(false);
        }
    };

    useEffect(() => { fetchHistory(1); }, []);

    const handleHistoryFilter = () => fetchHistory(1);

    const handleClearFilters = () => {
        setIssuedFrom("");
        setIssuedTo("");
        setTimeout(() => fetchHistory(1), 0);
    };

    // ── descarga histórico ────────────────────────────────────────────────
    const handleDownload = async (cert) => {
        setDownloading((p) => ({ ...p, [cert.id]: true }));
        try {
            const token = localStorage.getItem("token");
            const res   = await fetch(
                `${import.meta.env.VITE_URL_BASE}/certificates/${cert.id}/download`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                sendpush({ title: "Error", message: err.message ?? "No se encontró el archivo", type: "Push--danger", timeout: 3000 });
                return;
            }
            const blob = await res.blob();
            downloadBlob(blob, "application/pdf", `cert_${cert.credit?.sync_id}_${cert.client?.ci}`);
        } catch {
            sendpush({ title: "Error", message: "Error al descargar el certificado", type: "Push--danger", timeout: 3000 });
        } finally {
            setDownloading((p) => ({ ...p, [cert.id]: false }));
        }
    };

    const avail       = selectedCredit ? availableTypes(selectedCredit) : [];
    const placeholder = searchType === "credit_number" ? "Por Número de Crédito" :
                        searchType === "ci"            ? "Por Cédula" : "Por Nombre";

    return (
        <div className="Certificados">

            {/* ── TABS ──────────────────────────────────────────────────────── */}
            <div className="Certificados__tabs">
                <button
                    className={`Certificados__tab ${activeTab === "emitir" ? "active" : ""}`}
                    onClick={() => setActiveTab("emitir")}
                >
                    <FileText size={16} />
                    Emitir certificado
                </button>
                <button
                    className={`Certificados__tab ${activeTab === "consultar" ? "active" : ""}`}
                    onClick={() => { setActiveTab("consultar"); fetchHistory(1); }}
                >
                    <Download size={16} />
                    Consultar certificados
                </button>
            </div>

            {/* ── PANEL EMITIR ──────────────────────────────────────────────── */}
            {activeTab === "emitir" && (
                <div className={`Certificados__panel ${!searched && !selectedCredit ? "centered" : ""}`}>

                    <div className="Certificados__search-area">
                        {/* buscador */}
                        <div className="Certificados__search-box">
                            <input
                                type="text"
                                className="Certificados__search-input"
                                placeholder={placeholder}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="Certificados__search-button"
                                onClick={handleSearch}
                                disabled={searching}
                            >
                                {searching ? "Buscando..." : "Buscar"}
                            </button>
                        </div>

                        {/* radios */}
                        <div className="Certificados__radio-group">
                            <div className="Certificados__radio-block">
                                <span className="Certificados__radio-section-label">Buscar por</span>
                                <div className="Certificados__radio-options">
                                    {[
                                        { value: "credit_number", label: "Número de crédito" },
                                        { value: "ci",            label: "Cédula" },
                                        { value: "name",          label: "Nombre" },
                                    ].map(({ value, label }) => (
                                        <label key={value} className={`Certificados__radio-label ${searchType === value ? "active" : ""}`}>
                                            <input
                                                type="radio"
                                                name="certSearchType"
                                                value={value}
                                                checked={searchType === value}
                                                onChange={() => handleTypeChange(value)}
                                            />
                                            <span className="Certificados__radio-text">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* resultados */}
                    {searched && !selectedCredit && (
                        <div className="Certificados__results">
                            {searching ? (
                                <div className="Certificados__loading">Buscando...</div>
                            ) : results.length > 0 ? (
                                <>
                                    <div className="Certificados__results-header">
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
                                        <label>Cantón</label>
                                        <label>Estado campaña</label>
                                        <label>Estado crédito</label>
                                        <label>Agente</label>
                                    </div>
                                    {results.map((credit) => (
                                        <div key={credit.id} className="Certificados__results-item">
                                            <button
                                                className="Certificados__select-btn"
                                                onClick={() => selectCredit(credit)}
                                            >
                                                Seleccionar
                                            </button>
                                            <label>{credit.business_name}-{credit.sync_id}</label>
                                            <label>{credit.clients?.[0]?.name}</label>
                                            <label>{credit.clients?.[0]?.ci}</label>
                                            <label>{useFormatterNumber({ value: credit.total_amount, currency: "USD" })}</label>
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
                                    <div className="Certificados__results-footer">
                                        Mostrando {results.length} registro{results.length !== 1 ? "s" : ""}.
                                    </div>
                                </>
                            ) : (
                                <div className="Certificados__no-results">
                                    No se encontraron resultados para la búsqueda.
                                </div>
                            )}
                        </div>
                    )}

                    {/* crédito seleccionado */}
                    {selectedCredit && (
                        <div className="Certificados__card">
                            <div className="Certificados__card-header">
                                <div>
                                    <span className="Certificados__card-code">
                                        {selectedCredit.business_name}-{selectedCredit.sync_id}
                                    </span>
                                    <span className="Certificados__card-state">
                                        {selectedCredit.collection_state}
                                    </span>
                                </div>
                                <button
                                    className="Certificados__card-close"
                                    onClick={() => { setSelectedCredit(null); setTypes([]); }}
                                    type="button"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="Certificados__clients">
                                {avail.length === 0 && (
                                    <p className="Certificados__no-results">Este crédito no tiene titulares ni garantes registrados.</p>
                                )}
                                {avail.map((t) => {
                                    const client = selectedCredit.clients?.find((c) => c.type === t);
                                    return (
                                        <label key={t} className={`Certificados__client-chk ${types.includes(t) ? "checked" : ""}`}>
                                            <input
                                                type="checkbox"
                                                checked={types.includes(t)}
                                                onChange={() => toggleType(t)}
                                            />
                                            <div className="Certificados__client-info">
                                                <span className="Certificados__client-type">{t}</span>
                                                {client && (
                                                    <>
                                                        <span className="Certificados__client-name">{client.name}</span>
                                                        <span className="Certificados__client-ci">{client.ci}</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="Certificados__card-footer">
                                <button
                                    className="Certificados__gen-btn"
                                    onClick={handleGenerate}
                                    disabled={generating || types.length === 0}
                                >
                                    <FileText size={16} />
                                    {generating ? "Generando..." : "Generar certificado"}
                                </button>
                                {types.length === 0 && avail.length > 0 && (
                                    <span className="Certificados__hint">Seleccione al menos un tipo</span>
                                )}
                            </div>
                        </div>
                    )}

                    {!searched && !selectedCredit && (
                        <p className="Certificados__hint center">
                            Busque un crédito para generar un certificado de no adeudar.
                        </p>
                    )}
                </div>
            )}

            {/* ── PANEL CONSULTAR ───────────────────────────────────────────── */}
            {activeTab === "consultar" && (
                <div className="Certificados__panel">
                    <div className="Certificados__history-header">
                        <h3>Historial de certificados emitidos</h3>
                        <div className="Certificados__history-filters">
                            <label>
                                Desde
                                <input type="date" value={issuedFrom} onChange={(e) => setIssuedFrom(e.target.value)} />
                            </label>
                            <label>
                                Hasta
                                <input type="date" value={issuedTo} onChange={(e) => setIssuedTo(e.target.value)} />
                            </label>
                            <button className="Certificados__filter-btn" onClick={handleHistoryFilter}>Filtrar</button>
                            {(issuedFrom || issuedTo) && (
                                <button className="Certificados__clear-btn" onClick={handleClearFilters}>
                                    <X size={14} /> Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {loadingHist ? (
                        <div className="Certificados__loading">Cargando historial...</div>
                    ) : history.length === 0 ? (
                        <div className="Certificados__no-results">No hay certificados emitidos.</div>
                    ) : (
                        <>
                            <div className="Certificados__table-head">
                                <span>N° Crédito</span>
                                <span>Cliente</span>
                                <span>Cédula</span>
                                <span>Tipo</span>
                                <span>Emitido por</span>
                                <span>Fecha emisión</span>
                                <span>Descargar</span>
                            </div>
                            {history.map((cert) => (
                                <div key={cert.id} className="Certificados__table-row">
                                    <span>{cert.credit?.sync_id ?? "—"}</span>
                                    <span>{cert.client?.name ?? "—"}</span>
                                    <span>{cert.client?.ci ?? "—"}</span>
                                    <span>
                                        <span className={`Certificados__badge ${cert.type === "TITULAR" ? "titular" : "garante"}`}>
                                            {cert.type}
                                        </span>
                                    </span>
                                    <span>{cert.user?.name ?? "—"}</span>
                                    <span>{cert.issued_at}</span>
                                    <span>
                                        <button
                                            className="Certificados__dl-btn"
                                            onClick={() => handleDownload(cert)}
                                            disabled={!!downloading[cert.id]}
                                        >
                                            <Download size={14} />
                                            {downloading[cert.id] ? "..." : "PDF"}
                                        </button>
                                    </span>
                                </div>
                            ))}
                            {historyMeta && historyMeta.last_page > 1 && (
                                <div className="Certificados__pagination">
                                    <button onClick={() => fetchHistory(historyPage - 1)} disabled={historyPage <= 1}>← Anterior</button>
                                    <span>Página {historyPage} de {historyMeta.last_page}</span>
                                    <button onClick={() => fetchHistory(historyPage + 1)} disabled={historyPage >= historyMeta.last_page}>Siguiente →</button>
                                </div>
                            )}
                            {historyMeta && (
                                <p className="Certificados__history-total">
                                    Total: {historyMeta.total} certificado{historyMeta.total !== 1 ? "s" : ""}
                                </p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
