import { useState, useEffect } from "react";
import "./CardAddChild.css";
import useFetch from "../../../hooks/useFetch";
import sendpush from "../../../helpers/sendpush";

export default function CardAddChild({ parentState, onSave, onClose }) {
    const { fetchWithAuth } = useFetch();
    const [availableTemplates, setAvailableTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingTemplates, setFetchingTemplates] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setFetchingTemplates(true);
                const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/templates?only_roots=true`);
                const result = await response.json();

                let templates = [];
                if (result.code === 1 && result.result) {
                    if (result.result.data && Array.isArray(result.result.data)) {
                        templates = result.result.data;
                    } else if (Array.isArray(result.result)) {
                        templates = result.result;
                    }
                }

                // Filtrar para excluir el estado padre actual
                const filtered = templates.filter(t => t.id !== parentState.id);
                setAvailableTemplates(filtered);

                // Pre-seleccionar los hijos existentes del estado padre
                const existingChildren = parentState.children || [];
                const existingChildIds = existingChildren.map(child => child.id);
                setSelectedTemplates(existingChildIds);
            } catch (error) {
                console.error('Error fetching templates:', error);
                sendpush({
                    title: 'Error',
                    message: 'Error al cargar los templates disponibles',
                    type: 'Push--error',
                    timeout: 3000
                });
            } finally {
                setFetchingTemplates(false);
            }
        };

        fetchTemplates();
    }, [parentState.id, parentState.children]);

    const handleToggleTemplate = (templateId) => {
        setSelectedTemplates(prev => {
            if (prev.includes(templateId)) {
                return prev.filter(id => id !== templateId);
            } else {
                return [...prev, templateId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedTemplates.length === 0) {
            sendpush({
                title: 'Advertencia',
                message: 'Debes seleccionar al menos un template',
                type: 'Push--error',
                timeout: 3000
            });
            return;
        }

        setLoading(true);

        try {
            // Hacer PATCH a cada template seleccionado
            const promises = selectedTemplates.map(async (templateId) => {
                const template = availableTemplates.find(t => t.id === templateId);

                const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/templates/${templateId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: template.name,
                        is_active: template.is_active,
                        parent_ids: [parentState.id]
                    })
                });

                return response.json();
            });

            const results = await Promise.all(promises);

            // Verificar si todos fueron exitosos
            const allSuccess = results.every(r => r.code === 1);

            if (allSuccess) {
                sendpush({
                    title: 'Éxito',
                    message: `${selectedTemplates.length} hijo(s) agregado(s) correctamente`,
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                onSave();
            } else {
                throw new Error('Algunos templates no pudieron ser actualizados');
            }
        } catch (error) {
            console.error('Error adding children:', error);
            sendpush({
                title: 'Error',
                message: error.message || 'Error al agregar hijos',
                type: 'Push--error',
                timeout: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="CardAddChild">
            <h3 className="CardAddChild__title">
                Agregar hijos a: {parentState.name}
            </h3>

            <form onSubmit={handleSubmit} className="CardAddChild__form">
                <div className="CardAddChild__field">
                    <label>Selecciona los templates a agregar como hijos:</label>

                    {fetchingTemplates ? (
                        <p className="CardAddChild__loading">Cargando templates...</p>
                    ) : availableTemplates.length === 0 ? (
                        <p className="CardAddChild__noTemplates">No hay templates disponibles</p>
                    ) : (
                        <div className="CardAddChild__templateList">
                            {availableTemplates.map((template) => (
                                <label key={template.id} className="CardAddChild__templateOption">
                                    <input
                                        type="checkbox"
                                        checked={selectedTemplates.includes(template.id)}
                                        onChange={() => handleToggleTemplate(template.id)}
                                        disabled={loading}
                                    />
                                    <span>{template.name}</span>
                                    <span className={`CardAddChild__status ${template.is_active ? 'active' : 'inactive'}`}>
                                        {template.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="CardAddChild__actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="CardAddChild__btnCancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="CardAddChild__btnSave"
                        disabled={loading || selectedTemplates.length === 0}
                    >
                        {loading ? 'Guardando...' : `Agregar (${selectedTemplates.length})`}
                    </button>
                </div>
            </form>
        </div>
    );
}
