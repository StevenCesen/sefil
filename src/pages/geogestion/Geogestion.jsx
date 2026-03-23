import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./geogestion.css";
import { renderToString } from "react-dom/server";
import { Flag, MapPin, X, Search, Calendar, ChevronDown, ChevronRight } from "lucide-react";

// Inicio (bandera verde)
const startIcon = L.divIcon({
    html: renderToString(<Flag size={32} color="#4CAF50" fill="#4CAF50" strokeWidth={1.5} />),
    iconSize: [32, 32],
    iconAnchor: [4, 32],
    popupAnchor: [12, -32],
    className: 'custom-div-icon'
});

// Fin (pin rojo)
const endIcon = L.divIcon({
    html: renderToString(<MapPin size={40} color="#F44336" fill="#F44336" strokeWidth={1.5} />),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: 'custom-div-icon'
});

const selectedPointIcon = L.divIcon({
    html: `<div style="width:18px;height:18px;background:var(--color-2,#FF9619);border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.5);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    className: ''
});

const createArrowIcon = (bearing) => L.divIcon({
    html: `<div style="transform:rotate(${bearing}deg);font-size:18px;color:#009793;line-height:1;">➤</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: ''
});

const statusColors = {
    "FIRST DAY": "#4CAF50",
    "LUNCH":     "#FF9800",
    "BREAK":     "#2196F3",
    "END DAY":   "#F44336",
    "DEFAULT":   "#9E9E9E"
};

const statusLabels = {
    "FIRST DAY": "Inicio de jornada",
    "LUNCH":     "Almuerzo",
    "BREAK":     "Descanso",
    "END DAY":   "Fin de jornada"
};

const getBearing = (lat1, lng1, lat2, lng2) => {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1R = lat1 * Math.PI / 180;
    const lat2R = lat2 * Math.PI / 180;
    const y = Math.sin(dLng) * Math.cos(lat2R);
    const x = Math.cos(lat1R) * Math.sin(lat2R) - Math.sin(lat1R) * Math.cos(lat2R) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
};

// Controlador de vuelo del mapa
function MapController({ flyTo }) {
    const map = useMap();
    const prev = useRef(null);
    useEffect(() => {
        if (flyTo && flyTo !== prev.current) {
            prev.current = flyTo;
            map.flyTo(flyTo, 17, { duration: 1 });
        }
    }, [flyTo, map]);
    return null;
}

const ARROW_INTERVAL = 8; // una flecha cada N puntos

export default function Geogestion() {
    const [users, setUsers]               = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [gpsData, setGpsData]           = useState([]);
    const [loading, setLoading]           = useState(false);
    const [mapCenter, setMapCenter]       = useState([-3.9817390, -79.2041700]);
    const [totalDistance, setTotalDistance] = useState(null);
    const [showModal, setShowModal]       = useState(false);
    const [partialDistance, setPartialDistance] = useState(null);
    const [selectedPoints, setSelectedPoints]   = useState({ start: null, end: null });
    const [flyTo, setFlyTo]               = useState(null);
    const [highlightedPoint, setHighlightedPoint] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [dateFrom, setDateFrom]         = useState("");
    const [dateTo, setDateTo]             = useState("");

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res   = await fetch(
                `${import.meta.env.VITE_URL_BASE}/users?per_page=100&agents=true&is_active=1`,
                { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.code === 1) setUsers(data.result?.data || []);
        } catch (e) { console.error(e); }
    };

    const fetchGPSPoints = async (userId, fromDate = null, toDate = null) => {
        if (!userId) return;
        setLoading(true);
        setTotalDistance(null);
        setSelectedPoints({ start: null, end: null });
        try {
            const token = localStorage.getItem("token");
            let url = `${import.meta.env.VITE_URL_BASE}/gps-points?group_by_type_status=true&user_id=${userId}`;
            if (fromDate) url += `&date_from=${fromDate}`;
            if (toDate)   url += `&date_to=${toDate}`;
            const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.code === 1) {
                setGpsData(data.result);
                setExpandedGroups({});
                if (data.result.length > 0 && data.result[0].locations.length > 0) {
                    const first = data.result[0].locations[0];
                    setMapCenter([parseFloat(first.latitude), parseFloat(first.longitude)]);
                }
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const getAllPoints = () => {
        const pts = [];
        gpsData.forEach(g => g.locations.forEach(l => pts.push([parseFloat(l.latitude), parseFloat(l.longitude)])));
        return pts;
    };

    const getAllPointsWithDetails = () => {
        const pts = [];
        gpsData.forEach(g => g.locations.forEach(l => pts.push({
            lat: parseFloat(l.latitude), lng: parseFloat(l.longitude),
            type: g.type_status, hour: l.hour, battery: l.battery_percentage
        })));
        return pts;
    };

    const getGlobalIndex = (groupIndex, locIndex) => {
        let idx = 0;
        for (let i = 0; i < groupIndex; i++) idx += gpsData[i].locations.length;
        return idx + locIndex;
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    const calculateTotalDistance = () => {
        const pts = getAllPoints();
        let total = 0;
        for (let i = 0; i < pts.length - 1; i++)
            total += calculateDistance(pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1]);
        setTotalDistance(total);
    };

    const isPointSelected = (idx) => {
        if (selectedPoints.start === null) return false;
        if (selectedPoints.end === null) return idx === selectedPoints.start;
        return idx >= selectedPoints.start && idx <= selectedPoints.end;
    };

    const handlePointSelection = (idx) => {
        if (selectedPoints.start === null) {
            setSelectedPoints({ start: idx, end: null });
        } else if (selectedPoints.end === null) {
            if (idx > selectedPoints.start) {
                const allPts = getAllPointsWithDetails();
                const route = allPts.slice(selectedPoints.start, idx + 1);
                let dist = 0;
                for (let i = 0; i < route.length - 1; i++)
                    dist += calculateDistance(route[i].lat, route[i].lng, route[i+1].lat, route[i+1].lng);
                setPartialDistance(dist);
                setSelectedPoints({ ...selectedPoints, end: idx });
                setShowModal(true);
            } else {
                setSelectedPoints({ start: idx, end: null });
            }
        } else {
            setSelectedPoints({ start: idx, end: null });
        }
    };

    const getPartialRoutePoints = () => {
        if (selectedPoints.start === null || selectedPoints.end === null) return [];
        return getAllPoints().slice(selectedPoints.start, selectedPoints.end + 1);
    };

    const toggleGroup = (index) => {
        setExpandedGroups(prev => ({ ...prev, [index]: !prev[index] }));
    };

    // Construir flechas en la ruta
    const arrowMarkers = () => {
        const allPts = getAllPointsWithDetails();
        const markers = [];
        for (let i = ARROW_INTERVAL; i < allPts.length - 1; i += ARROW_INTERVAL) {
            const bearing = getBearing(allPts[i-1].lat, allPts[i-1].lng, allPts[i].lat, allPts[i].lng);
            markers.push({ lat: allPts[i].lat, lng: allPts[i].lng, bearing });
        }
        return markers;
    };

    const totalPoints = gpsData.reduce((a, g) => a + g.locations.length, 0);

    return (
        <div className="geogestion-container">
            <div className="geogestion-header">
                <h1>Geogestión</h1>
                <div className="user-selector">
                    <label>Seleccionar Agente:</label>
                    <select value={selectedUser} onChange={(e) => {
                        setSelectedUser(e.target.value);
                        if (e.target.value) fetchGPSPoints(e.target.value, dateFrom || null, dateTo || null);
                        else setGpsData([]);
                    }}>
                        <option value="">-- Seleccione un usuario --</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name} {u.lastname}</option>)}
                    </select>

                    <div className="date-filters">
                        <label className="date-filter-label">
                            <Calendar size={16} /><span>Desde:</span>
                            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="date-input" />
                        </label>
                        <label className="date-filter-label">
                            <Calendar size={16} /><span>Hasta:</span>
                            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="date-input" />
                        </label>
                        <button className="search-btn" onClick={() => selectedUser && fetchGPSPoints(selectedUser, dateFrom || null, dateTo || null)} disabled={!selectedUser}>
                            <Search size={16} /> Buscar
                        </button>
                    </div>

                    {selectedUser && gpsData.length > 0 && (
                        <button className="measure-distance-btn" onClick={calculateTotalDistance}>
                            Medir Distancia
                        </button>
                    )}
                    {totalDistance !== null && (
                        <div className="distance-display">
                            <strong>Distancia total:</strong> {totalDistance.toFixed(2)} km
                        </div>
                    )}
                </div>
            </div>

            {loading && <div className="loading">Cargando datos...</div>}

            <div className="geogestion-content">
                <div className="map-container">
                    <MapContainer center={mapCenter} zoom={15} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        <MapController flyTo={flyTo} />

                        {gpsData.length > 0 && (
                            <Polyline positions={getAllPoints()} color="#000000" weight={4} opacity={0.8} />
                        )}

                        {/* Flechas de dirección */}
                        {arrowMarkers().map((a, i) => (
                            <Marker key={`arrow-${i}`} position={[a.lat, a.lng]} icon={createArrowIcon(a.bearing)} />
                        ))}

                        {/* Solo inicio y fin */}
                        {totalPoints > 0 && (() => {
                            const allPts = getAllPointsWithDetails();
                            const first  = allPts[0];
                            const last   = allPts[allPts.length - 1];
                            return <>
                                <Marker position={[first.lat, first.lng]} icon={startIcon}>
                                    <Popup><strong>🚩 Inicio</strong><br/>Hora: {first.hour}<br/>Batería: {first.battery}</Popup>
                                </Marker>
                                {allPts.length > 1 && (
                                    <Marker position={[last.lat, last.lng]} icon={endIcon}>
                                        <Popup><strong>📍 Fin / Ubicación actual</strong><br/>Hora: {last.hour}<br/>Batería: {last.battery}</Popup>
                                    </Marker>
                                )}
                            </>;
                        })()}

                        {/* Marcador del punto seleccionado desde el nav */}
                        {highlightedPoint && (
                            <Marker position={[highlightedPoint.lat, highlightedPoint.lng]} icon={selectedPointIcon}>
                                <Popup>
                                    <strong>📌 Punto seleccionado</strong><br/>
                                    Hora: {highlightedPoint.hour}<br/>
                                    Batería: {highlightedPoint.battery}
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>

                {/* Panel lateral colapsable */}
                <div className="data-table-container">
                    <h3>Puntos GPS por Estado</h3>
                    {selectedPoints.start !== null && (
                        <div className="selection-info">
                            <p>{selectedPoints.end === null ? "Seleccione un punto final" : `Ruta: ${selectedPoints.start + 1} → ${selectedPoints.end + 1}`}</p>
                            {selectedPoints.end === null && (
                                <button className="clear-selection-btn" onClick={() => setSelectedPoints({ start: null, end: null })}>
                                    Limpiar
                                </button>
                            )}
                        </div>
                    )}

                    {gpsData.length > 0 ? (
                        <div className="status-groups">
                            {gpsData.map((group, gIdx) => {
                                const color   = statusColors[group.type_status] || statusColors.DEFAULT;
                                const label   = statusLabels[group.type_status] || group.type_status;
                                const first   = group.locations[0];
                                const lastLoc = group.locations[group.locations.length - 1];
                                const expanded = expandedGroups[gIdx] !== false;
                                return (
                                    <div key={gIdx} className="status-group">
                                        <div
                                            className="status-header"
                                            style={{ borderLeft: `4px solid ${color}`, cursor: 'pointer' }}
                                            onClick={() => toggleGroup(gIdx)}
                                        >
                                            <div className="status-header-left">
                                                {expanded ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                                <h4>{label}</h4>
                                            </div>
                                            <div className="status-header-right">
                                                <span className="status-time">{first?.hour} – {lastLoc?.hour}</span>
                                                <span className="total-badge">{group.total} pts</span>
                                            </div>
                                        </div>

                                        {expanded && (
                                            <table className="points-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Hora</th>
                                                        <th>Batería</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.locations.map((loc, lIdx) => {
                                                        const gIdx2  = getGlobalIndex(gIdx, lIdx);
                                                        const isSel  = isPointSelected(gIdx2);
                                                        return (
                                                            <tr
                                                                key={lIdx}
                                                                className={isSel ? 'selected-point' : 'selectable-point'}
                                                                onClick={() => {
                                                                    const pos = [parseFloat(loc.latitude), parseFloat(loc.longitude)];
                                                                    setFlyTo(pos);
                                                                    setHighlightedPoint({ lat: pos[0], lng: pos[1], hour: loc.hour, battery: loc.battery_percentage });
                                                                    handlePointSelection(gIdx2);
                                                                }}
                                                                title={`Lat: ${loc.latitude}  Lng: ${loc.longitude}`}
                                                            >
                                                                <td>{gIdx2 + 1}</td>
                                                                <td>{loc.hour}</td>
                                                                <td>{loc.battery_percentage}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="no-data">Seleccione un usuario para ver los datos GPS</p>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Ruta Seleccionada</h2>
                            <button className="close-modal" onClick={() => setShowModal(false)}><X size={20}/></button>
                        </div>
                        <div className="modal-body">
                            <div className="route-info">
                                <p><strong>Punto inicial:</strong> {selectedPoints.start + 1}</p>
                                <p><strong>Punto final:</strong> {selectedPoints.end + 1}</p>
                                <p><strong>Distancia:</strong> {partialDistance?.toFixed(2)} km</p>
                                <p><strong>Puntos:</strong> {selectedPoints.end - selectedPoints.start + 1}</p>
                            </div>
                            <div className="modal-map">
                                <MapContainer center={getPartialRoutePoints()[0] || mapCenter} zoom={15} style={{ height: "400px", width: "100%" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap'/>
                                    <Polyline positions={getPartialRoutePoints()} color="#FF5722" weight={6} opacity={1}/>
                                    {getPartialRoutePoints().length > 0 && <>
                                        <Marker position={getPartialRoutePoints()[0]} icon={startIcon}/>
                                        <Marker position={getPartialRoutePoints()[getPartialRoutePoints().length - 1]} icon={endIcon}/>
                                    </>}
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
