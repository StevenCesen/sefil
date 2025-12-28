import { useEffect, useState } from "react";
import "./CardPrelacion.css";
import sendpush from "../../helpers/sendpush";
import useFetch from "../../hooks/useFetch";

// Mapeo de valores del backend a labels en español
const PRELATION_LABELS = {
    'capital': 'Capital',
    'interest': 'Interés',
    'mora': 'Mora',
    'safe': 'Seguro',
    'legal_expenses': 'Gastos judiciales',
    'other_values': 'Otros valores',
    'collection_expenses': 'Gastos de cobranza'
};

// Mapeo inverso: de labels a valores del backend
const PRELATION_VALUES = Object.fromEntries(
    Object.entries(PRELATION_LABELS).map(([key, value]) => [value, key])
);

export default function CardPrelacion({ cartera, onClose }) {
    const { fetchWithAuth } = useFetch();
    const [prelationOrder, setPrelationOrder] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (cartera) {
            // Si no hay orden de prelación o está vacío, usar orden por defecto
            if (!cartera.orden_prelacion || cartera.orden_prelacion === '[]' ||
                (Array.isArray(cartera.orden_prelacion) && cartera.orden_prelacion.length === 0)) {
                // Orden por defecto: todos los campos disponibles
                const defaultOrder = Object.values(PRELATION_LABELS);
                setPrelationOrder(defaultOrder);
            } else {
                try {
                    const order = typeof cartera.orden_prelacion === 'string'
                        ? JSON.parse(cartera.orden_prelacion)
                        : cartera.orden_prelacion;

                    // Convertir valores del backend a labels
                    const labels = order.map(item => PRELATION_LABELS[item] || item);
                    setPrelationOrder(labels);
                } catch (error) {
                    console.error('Error parsing orden_prelacion:', error);
                    // En caso de error, usar orden por defecto
                    const defaultOrder = Object.values(PRELATION_LABELS);
                    setPrelationOrder(defaultOrder);
                }
            }
        }
    }, [cartera]);

    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target);
        e.target.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();

        if (draggedItem === null) return;
        if (draggedItem === index) return;

        setDragOverIndex(index);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();

        if (draggedItem === null) return;
        if (draggedItem === dropIndex) return;

        const newOrder = [...prelationOrder];
        const draggedElement = newOrder[draggedItem];

        // Remover el elemento de su posición original
        newOrder.splice(draggedItem, 1);

        // Insertar en la nueva posición
        newOrder.splice(dropIndex, 0, draggedElement);

        setPrelationOrder(newOrder);
        setDragOverIndex(null);
    };

    const handleSave = async () => {
        if (prelationOrder.length === 0) {
            sendpush({
                title: 'Error de validación',
                message: 'Debe definir un orden de prelación',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        setSaving(true);

        try {
            // Convertir labels a valores del backend
            const backendOrder = prelationOrder.map(label => PRELATION_VALUES[label] || label);

            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/businesses/${cartera.id}/prelation`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prelation_order: backendOrder
                })
            });

            const data = await response.json();

            if (data.code === 1) {
                sendpush({
                    title: 'Orden guardado',
                    message: 'El orden de prelación se guardó correctamente',
                    type: 'Push--sucessful',
                    timeout: 5000
                });
                setIsEditing(false);
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'Error al guardar el orden de prelación',
                    type: 'Push--warning',
                    timeout: 5000
                });
            }
        } catch (error) {
            console.error('Error saving prelation order:', error);
            sendpush({
                title: 'Error',
                message: 'Error al guardar el orden de prelación',
                type: 'Push--error',
                timeout: 5000
            });
        } finally {
            setSaving(false);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    if (!cartera) return null;

    return (
        <div className="CardPrelacion">
            <div className="CardPrelacion__head">
                <span>Orden de prelación</span>
                {onClose && (
                    <button className="CardPrelacion__closeBtn" onClick={onClose}>
                        ✕
                    </button>
                )}
            </div>

            <div className="CardPrelacion__content">
                <div className="CardPrelacion__columns">
                    {/* Columna izquierda: Orden actual (solo lectura) */}
                    <div className="CardPrelacion__column">
                        <div className="CardPrelacion__columnHeader">
                            <span>Orden actual</span>
                        </div>
                        <div className="CardPrelacion__items">
                            {prelationOrder.map((item, index) => (
                                <div
                                    key={`current-${item}-${index}`}
                                    className="CardPrelacion__item"
                                >
                                    <div className="CardPrelacion__itemNumber">{index + 1}</div>
                                    <div className="CardPrelacion__itemLabel">{item}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Columna derecha: Cambiar orden (arrastrable) */}
                    <div className="CardPrelacion__column">
                        <div className="CardPrelacion__columnHeader">
                            <span>Cambiar orden</span>
                            <button className="CardPrelacion__toggleBtn" onClick={toggleEdit}>
                                {isEditing ? 'Cancelar' : 'Editar'}
                            </button>
                        </div>

                        {isEditing && (
                            <div className="CardPrelacion__hint">
                                <p>Arrastra los elementos para reordenar la prelación</p>
                            </div>
                        )}

                        <div className="CardPrelacion__items">
                            {prelationOrder.map((item, index) => (
                                <div
                                    key={`edit-${item}-${index}`}
                                    className={`CardPrelacion__item ${isEditing ? 'editable' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                                    draggable={isEditing}
                                    onDragStart={(e) => isEditing && handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => isEditing && handleDragOver(e, index)}
                                    onDrop={(e) => isEditing && handleDrop(e, index)}
                                >
                                    <div className="CardPrelacion__itemNumber">{index + 1}</div>
                                    <div className="CardPrelacion__itemLabel">{item}</div>
                                    {isEditing && (
                                        <div className="CardPrelacion__itemHandle">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <circle cx="4" cy="4" r="1.5"/>
                                                <circle cx="4" cy="8" r="1.5"/>
                                                <circle cx="4" cy="12" r="1.5"/>
                                                <circle cx="8" cy="4" r="1.5"/>
                                                <circle cx="8" cy="8" r="1.5"/>
                                                <circle cx="8" cy="12" r="1.5"/>
                                                <circle cx="12" cy="4" r="1.5"/>
                                                <circle cx="12" cy="8" r="1.5"/>
                                                <circle cx="12" cy="12" r="1.5"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="CardPrelacion__footer">
                <button
                    onClick={handleSave}
                    disabled={saving || !isEditing}
                    className={!isEditing ? 'disabled' : ''}
                >
                    {saving ? 'Guardando...' : 'Guardar y aplicar'}
                </button>
            </div>
        </div>
    );
}