import { useState, useEffect } from "react";
import { MapPin, Plus, X, Navigation, Home, Building, Briefcase } from "lucide-react";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import sendpush from "../../../helpers/sendpush";
import "./SectionDirections.css";

const directionTypes = [
    { value: 'DOMICILIO', label: 'Domicilio', icon: Home },
    { value: 'TRABAJO', label: 'Trabajo', icon: Briefcase },
    { value: 'COMERCIAL', label: 'Comercial', icon: Building },
    { value: 'OTRO', label: 'Otro', icon: MapPin }
];

export default function SectionDirections() {
    const store_management = useStoreManagement();
    const [directions, setDirections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [newDirection, setNewDirection] = useState({
        type: 'DOMICILIO',
        direction: '',
        neighborhood: '',
        parish: '',
        canton: '',
        province: '',
        reference: '',
        latitude: '',
        longitude: ''
    });

    const client_id = store_management.client_id;

    useEffect(() => {
        if (client_id) {
            fetchDirections();
        }
    }, [client_id]);

    const fetchDirections = async () => {
        if (!client_id) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/clients/${client_id}/directions`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();

            if (data.code === 1) {
                setDirections(data.result?.data || data.result || []);
            }
        } catch (error) {
            console.error("Error fetching directions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDirection(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setNewDirection(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6)
                    }));
                    sendpush({
                        title: 'Ubicación obtenida',
                        message: 'Se obtuvo la ubicación actual',
                        type: 'Push--sucessful',
                        timeout: 2000
                    });
                },
                (error) => {
                    sendpush({
                        title: 'Error',
                        message: 'No se pudo obtener la ubicación',
                        type: 'Push--danger',
                        timeout: 3000
                    });
                }
            );
        } else {
            sendpush({
                title: 'Error',
                message: 'Geolocalización no soportada',
                type: 'Push--danger',
                timeout: 3000
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newDirection.direction.trim()) {
            sendpush({
                title: 'Error',
                message: 'La dirección es requerida',
                type: 'Push--warning',
                timeout: 3000
            });
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/clients/${client_id}/directions`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newDirection)
                }
            );
            const data = await response.json();

            if (data.code === 1) {
                sendpush({
                    title: 'Dirección agregada',
                    message: 'La dirección se guardó correctamente',
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                setShowForm(false);
                setNewDirection({
                    type: 'DOMICILIO',
                    direction: '',
                    neighborhood: '',
                    parish: '',
                    canton: '',
                    province: '',
                    reference: '',
                    latitude: '',
                    longitude: ''
                });
                fetchDirections();
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'No se pudo guardar la dirección',
                    type: 'Push--danger',
                    timeout: 3000
                });
            }
        } catch (error) {
            console.error("Error saving direction:", error);
            sendpush({
                title: 'Error',
                message: 'Error al guardar la dirección',
                type: 'Push--danger',
                timeout: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    const getTypeIcon = (type) => {
        const found = directionTypes.find(d => d.value === type);
        if (found) {
            const Icon = found.icon;
            return <Icon size={16} />;
        }
        return <MapPin size={16} />;
    };

    return (
        <div className="SectionDirections">
            <div className="SectionDirections__header">
                <h4>
                    <MapPin size={18} />
                    Direcciones del Cliente
                </h4>
                <button
                    className="SectionDirections__addBtn"
                    onClick={() => setShowForm(!showForm)}
                    title={showForm ? "Cancelar" : "Agregar dirección"}
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                </button>
            </div>

            {showForm && (
                <form className="SectionDirections__form" onSubmit={handleSubmit}>
                    <div className="SectionDirections__formRow">
                        <label>
                            Tipo
                            <select
                                name="type"
                                value={newDirection.type}
                                onChange={handleInputChange}
                            >
                                {directionTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="SectionDirections__formRow">
                        <label>
                            Dirección *
                            <input
                                type="text"
                                name="direction"
                                value={newDirection.direction}
                                onChange={handleInputChange}
                                placeholder="Calle principal, número..."
                                required
                            />
                        </label>
                    </div>

                    <div className="SectionDirections__formRow SectionDirections__formRow--half">
                        <label>
                            Barrio
                            <input
                                type="text"
                                name="neighborhood"
                                value={newDirection.neighborhood}
                                onChange={handleInputChange}
                                placeholder="Barrio o sector"
                            />
                        </label>
                        <label>
                            Parroquia
                            <input
                                type="text"
                                name="parish"
                                value={newDirection.parish}
                                onChange={handleInputChange}
                                placeholder="Parroquia"
                            />
                        </label>
                    </div>

                    <div className="SectionDirections__formRow SectionDirections__formRow--half">
                        <label>
                            Cantón
                            <input
                                type="text"
                                name="canton"
                                value={newDirection.canton}
                                onChange={handleInputChange}
                                placeholder="Cantón"
                            />
                        </label>
                        <label>
                            Provincia
                            <input
                                type="text"
                                name="province"
                                value={newDirection.province}
                                onChange={handleInputChange}
                                placeholder="Provincia"
                            />
                        </label>
                    </div>

                    <div className="SectionDirections__formRow">
                        <label>
                            Referencia
                            <input
                                type="text"
                                name="reference"
                                value={newDirection.reference}
                                onChange={handleInputChange}
                                placeholder="Cerca de..."
                            />
                        </label>
                    </div>

                    <div className="SectionDirections__formRow SectionDirections__formRow--coords">
                        <label>
                            Latitud
                            <input
                                type="text"
                                name="latitude"
                                value={newDirection.latitude}
                                onChange={handleInputChange}
                                placeholder="-3.9817"
                            />
                        </label>
                        <label>
                            Longitud
                            <input
                                type="text"
                                name="longitude"
                                value={newDirection.longitude}
                                onChange={handleInputChange}
                                placeholder="-79.2041"
                            />
                        </label>
                        <button
                            type="button"
                            className="SectionDirections__geoBtn"
                            onClick={handleGetLocation}
                            title="Obtener ubicación actual"
                        >
                            <Navigation size={18} />
                        </button>
                    </div>

                    <div className="SectionDirections__formActions">
                        <button
                            type="button"
                            className="SectionDirections__cancelBtn"
                            onClick={() => setShowForm(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="SectionDirections__saveBtn"
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar dirección'}
                        </button>
                    </div>
                </form>
            )}

            <div className="SectionDirections__list">
                {loading ? (
                    <p className="SectionDirections__loading">Cargando direcciones...</p>
                ) : directions.length > 0 ? (
                    directions.map((direction, index) => (
                        <div key={direction.id || index} className="SectionDirections__item">
                            <div className="SectionDirections__itemHeader">
                                {getTypeIcon(direction.type)}
                                <span className="SectionDirections__itemType">
                                    {direction.type || 'Dirección'}
                                </span>
                            </div>
                            <div className="SectionDirections__itemContent">
                                <p className="SectionDirections__address">
                                    {direction.direction || direction.address || 'Sin dirección'}
                                </p>
                                {direction.neighborhood && (
                                    <p className="SectionDirections__detail">
                                        <strong>Barrio:</strong> {direction.neighborhood}
                                    </p>
                                )}
                                {direction.parish && (
                                    <p className="SectionDirections__detail">
                                        <strong>Parroquia:</strong> {direction.parish}
                                    </p>
                                )}
                                {direction.canton && (
                                    <p className="SectionDirections__detail">
                                        <strong>Cantón:</strong> {direction.canton}
                                    </p>
                                )}
                                {direction.province && (
                                    <p className="SectionDirections__detail">
                                        <strong>Provincia:</strong> {direction.province}
                                    </p>
                                )}
                                {direction.reference && (
                                    <p className="SectionDirections__reference">
                                        <strong>Ref:</strong> {direction.reference}
                                    </p>
                                )}
                                {(direction.latitude && direction.longitude) && (
                                    <p className="SectionDirections__coords">
                                        <Navigation size={12} />
                                        {parseFloat(direction.latitude).toFixed(6)}, {parseFloat(direction.longitude).toFixed(6)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="SectionDirections__empty">
                        No hay direcciones registradas
                    </p>
                )}
            </div>
        </div>
    );
}
