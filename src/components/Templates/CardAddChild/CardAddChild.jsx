import { useState, useEffect } from "react";
import "./CardAddChild.css";
import useFetch from "../../../hooks/useFetch";
import sendpush from "../../../helpers/sendpush";

export default function CardAddChild({ parentState, onSave, onClose }) {
    const { fetchWithAuth } = useFetch();
    const [availableTemplates, setAvailableTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [templateRoles, setTemplateRoles] = useState({}); // {templateId: [roles]}
    const [loading, setLoading] = useState(false);
    const [fetchingTemplates, setFetchingTemplates] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setFetchingTemplates(true);
                const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/templates?group=hierarchical`);
                const result = await response.json();

                let templates = [];
                if (result.code === 1 && result.result) {
                    if (Array.isArray(result.result)) {
                        templates = result.result;
                    } else if (result.result.data && Array.isArray(result.result.data)) {
                        templates = result.result.data;
                    }
                }

                // Filtrar para excluir el estado padre actual
                const filtered = templates.filter(t => t.id !== parentState.id);
                setAvailableTemplates(filtered);

                // Pre-seleccionar los hijos existentes del estado padre y sus roles
                const existingChildren = parentState.children || [];
                const existingChildIds = existingChildren.map(child => child.id);
                setSelectedTemplates(existingChildIds);

                // Pre-cargar roles existentes de los hijos
                const rolesMap = {};
                existingChildren.forEach(child => {
                    if (child.roles) {
                        try {
                            rolesMap[child.id] = typeof child.roles === 'string'
                                ? JSON.parse(child.roles)
                                : child.roles;
                        } catch (e) {
                            rolesMap[child.id] = [];
                        }
                    }
                });
                setTemplateRoles(rolesMap);
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

    const handleRoleToggle = (templateId, role) => {
        setTemplateRoles(prev => {
            const currentRoles = prev[templateId] || [];
            const isSelected = currentRoles.includes(role);
            return {
                ...prev,
                [templateId]: isSelected
                    ? currentRoles.filter(r => r !== role)
                    : [...currentRoles, role]
            };
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

                const body = {
                    name: template.name,
                    is_active: template.is_active,
                    parent_ids: [parentState.id]
                };

                // Agregar roles si se han seleccionado
                const roles = templateRoles[templateId];
                if (roles && roles.length > 0) {
                    body.roles = roles;
                }

                const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/templates/${templateId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
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
                                <div key={template.id} className="CardAddChild__templateWrapper">
                                    <label className="CardAddChild__templateOption">
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

                                    {selectedTemplates.includes(template.id) && (
                                        <div className="CardAddChild__rolesContainer">
                                            <label className="CardAddChild__rolesLabel">Roles permitidos:</label>
                                            <div className="CardAddChild__rolesOptions">
                                                {['admin', 'supervisor', 'campo', 'call', 'legal'].map((role) => (
                                                    <label key={role} className="CardAddChild__roleOption">
                                                        <input
                                                            type="checkbox"
                                                            checked={(templateRoles[template.id] || []).includes(role)}
                                                            onChange={() => handleRoleToggle(template.id, role)}
                                                            disabled={loading}
                                                        />
                                                        <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
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
