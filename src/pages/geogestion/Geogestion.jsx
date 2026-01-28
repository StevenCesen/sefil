import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./geogestion.css";
import icoMarker from "/icons/ico.ico";

// Custom marker icon using the ico file
const createCustomIcon = (color) => {
    return L.icon({
        iconUrl: icoMarker,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: 'custom-ico-marker'
    });
};

const statusColors = {
    "FIRST DAY": "#4CAF50",
    "LUNCH": "#FF9800",
    "BREAK": "#2196F3",
    "END DAY": "#F44336",
    "DEFAULT": "#9E9E9E"
};

export default function Geogestion() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [gpsData, setGpsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState([-3.9817390, -79.2041700]);
    const [totalDistance, setTotalDistance] = useState(null);
    const [selectedPoints, setSelectedPoints] = useState({ start: null, end: null });
    const [showModal, setShowModal] = useState(false);
    const [partialDistance, setPartialDistance] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/users?per_page=100&agents=true&is_active=1`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (data.code === 1) {
                setUsers(data.result?.data || []);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchGPSPoints = async (userId) => {
        if (!userId) return;
        
        setLoading(true);
        setTotalDistance(null);
        setSelectedPoints({ start: null, end: null });
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/gps-points?group_by_type_status=true&user_id=${userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            
            if (data.code === 1) {
                setGpsData(data.result);
                
                if (data.result.length > 0 && data.result[0].locations.length > 0) {
                    const firstLocation = data.result[0].locations[0];
                    setMapCenter([parseFloat(firstLocation.latitude), parseFloat(firstLocation.longitude)]);
                }
            }
        } catch (error) {
            console.error("Error fetching GPS points:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        fetchGPSPoints(userId);
    };

    const getAllPoints = () => {
        const points = [];
        gpsData.forEach(group => {
            group.locations.forEach(location => {
                points.push([parseFloat(location.latitude), parseFloat(location.longitude)]);
            });
        });
        return points;
    };

    const getAllPointsWithDetails = () => {
        const points = [];
        gpsData.forEach(group => {
            group.locations.forEach(location => {
                points.push({
                    lat: parseFloat(location.latitude),
                    lng: parseFloat(location.longitude),
                    type: group.type_status,
                    hour: location.hour,
                    battery: location.battery_percentage
                });
            });
        });
        return points;
    };

    // Función para calcular distancia entre dos puntos usando la fórmula de Haversine
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const calculateTotalDistance = () => {
        const points = getAllPoints();
        if (points.length < 2) {
            setTotalDistance(0);
            return;
        }

        let total = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const [lat1, lon1] = points[i];
            const [lat2, lon2] = points[i + 1];
            total += calculateDistance(lat1, lon1, lat2, lon2);
        }

        setTotalDistance(total);
    };

    const handlePointSelection = (index, groupIndex, locIndex) => {
        const pointIndex = index;
        
        if (selectedPoints.start === null) {
            setSelectedPoints({ start: pointIndex, end: null });
        } else if (selectedPoints.end === null) {
            if (pointIndex > selectedPoints.start) {
                setSelectedPoints({ ...selectedPoints, end: pointIndex });
                calculatePartialRoute(selectedPoints.start, pointIndex);
            } else {
                setSelectedPoints({ start: pointIndex, end: null });
            }
        } else {
            setSelectedPoints({ start: pointIndex, end: null });
        }
    };

    const calculatePartialRoute = (startIdx, endIdx) => {
        const allPoints = getAllPointsWithDetails();
        const routePoints = allPoints.slice(startIdx, endIdx + 1);
        
        let distance = 0;
        for (let i = 0; i < routePoints.length - 1; i++) {
            distance += calculateDistance(
                routePoints[i].lat,
                routePoints[i].lng,
                routePoints[i + 1].lat,
                routePoints[i + 1].lng
            );
        }

        setPartialDistance(distance);
        setShowModal(true);
    };

    const getPartialRoutePoints = () => {
        if (selectedPoints.start === null || selectedPoints.end === null) return [];
        
        const allPoints = getAllPoints();
        return allPoints.slice(selectedPoints.start, selectedPoints.end + 1);
    };

    const getGlobalIndex = (groupIndex, locIndex) => {
        let index = 0;
        for (let i = 0; i < groupIndex; i++) {
            index += gpsData[i].locations.length;
        }
        return index + locIndex;
    };

    const isPointSelected = (globalIndex) => {
        if (selectedPoints.start === null) return false;
        if (selectedPoints.end === null) return globalIndex === selectedPoints.start;
        return globalIndex >= selectedPoints.start && globalIndex <= selectedPoints.end;
    };

    return (
        <div className="geogestion-container">
            <div className="geogestion-header">
                <h1>Geogestión</h1>
                <div className="user-selector">
                    <label>Seleccionar Agente:</label>
                    <select value={selectedUser} onChange={handleUserChange}>
                        <option value="">-- Seleccione un usuario --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} {user.lastname}
                            </option>
                        ))}
                    </select>
                    
                    {selectedUser && gpsData.length > 0 && (
                        <button 
                            className="measure-distance-btn"
                            onClick={calculateTotalDistance}
                        >
                            <i className="fa fa-ruler"></i> Medir Distancia
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
                    <MapContainer
                        center={mapCenter}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        
                        {gpsData.length > 0 && (
                            <Polyline
                                positions={getAllPoints()}
                                color="#000000"
                                weight={6}
                                opacity={1}
                            />
                        )}

                        {gpsData.map((group, groupIndex) => (
                            group.locations.map((location, locationIndex) => (
                                <Marker
                                    key={`${groupIndex}-${locationIndex}`}
                                    position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
                                    icon={createCustomIcon(statusColors[group.type_status] || statusColors.DEFAULT)}
                                >
                                    <Popup>
                                        <div className="marker-popup">
                                            <strong>{group.type_status}</strong>
                                            <p>Hora: {location.hour}</p>
                                            <p>Batería: {location.battery_percentage}</p>
                                            <p>Lat: {location.latitude}</p>
                                            <p>Lng: {location.longitude}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))
                        ))}
                    </MapContainer>
                </div>

                <div className="data-table-container">
                    <h3>Puntos GPS por Estado</h3>
                    {selectedPoints.start !== null && (
                        <div className="selection-info">
                            <p>
                                {selectedPoints.end === null 
                                    ? "Seleccione un punto final" 
                                    : `Ruta seleccionada: Punto ${selectedPoints.start + 1} - Punto ${selectedPoints.end + 1}`}
                            </p>
                            {selectedPoints.start !== null && selectedPoints.end === null && (
                                <button 
                                    className="clear-selection-btn"
                                    onClick={() => setSelectedPoints({ start: null, end: null })}
                                >
                                    Limpiar selección
                                </button>
                            )}
                        </div>
                    )}
                    {gpsData.length > 0 ? (
                        <div className="status-groups">
                            {gpsData.map((group, index) => (
                                <div key={index} className="status-group">
                                    <div className="status-header" style={{ borderLeft: `4px solid ${statusColors[group.type_status] || statusColors.DEFAULT}` }}>
                                        <h4>{group.type_status}</h4>
                                        <span className="total-badge">{group.total} punto(s)</span>
                                    </div>
                                    <table className="points-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Latitud</th>
                                                <th>Longitud</th>
                                                <th>Batería</th>
                                                <th>Hora</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.locations.map((location, locIndex) => {
                                                const globalIndex = getGlobalIndex(index, locIndex);
                                                const isSelected = isPointSelected(globalIndex);
                                                
                                                return (
                                                    <tr 
                                                        key={locIndex}
                                                        className={isSelected ? 'selected-point' : 'selectable-point'}
                                                        onClick={() => handlePointSelection(globalIndex, index, locIndex)}
                                                    >
                                                        <td>{globalIndex + 1}</td>
                                                        <td>{location.latitude}</td>
                                                        <td>{location.longitude}</td>
                                                        <td>{location.battery_percentage}</td>
                                                        <td>{location.hour}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">Seleccione un usuario para ver los datos GPS</p>
                    )}
                </div>
            </div>

            {/* Modal para mostrar ruta parcial */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Ruta Seleccionada</h2>
                            <button className="close-modal" onClick={() => setShowModal(false)}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="route-info">
                                <p><strong>Punto inicial:</strong> {selectedPoints.start + 1}</p>
                                <p><strong>Punto final:</strong> {selectedPoints.end + 1}</p>
                                <p><strong>Distancia:</strong> {partialDistance?.toFixed(2)} km</p>
                                <p><strong>Puntos en la ruta:</strong> {selectedPoints.end - selectedPoints.start + 1}</p>
                            </div>
                            <div className="modal-map">
                                <MapContainer
                                    center={getPartialRoutePoints()[0] || mapCenter}
                                    zoom={15}
                                    style={{ height: "400px", width: "100%" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    
                                    <Polyline
                                        positions={getPartialRoutePoints()}
                                        color="#FF5722"
                                        weight={6}
                                        opacity={1}
                                    />

                                    {getPartialRoutePoints().map((point, idx) => (
                                        <Marker
                                            key={idx}
                                            position={point}
                                            icon={createCustomIcon(idx === 0 ? "#4CAF50" : idx === getPartialRoutePoints().length - 1 ? "#F44336" : "#2196F3")}
                                        />
                                    ))}
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}