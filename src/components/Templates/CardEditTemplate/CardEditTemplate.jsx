import { useState, useEffect } from "react";
import "./CardEditTemplate.css";
import useFetch from "../../../hooks/useFetch";
import { useStoreTemplate } from "../../../stores/useStoreTemplates";
import sendpush from "../../../helpers/sendpush";

export default function CardEditTemplate({ type, mode, data, stateId, onSave, onClose }) {
    const { fetchWithAuth } = useFetch();
    const store_templates = useStoreTemplate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
        parent_ids: [],
        roles: [],
        days_past_due_min: null
    });
    const [loading, setLoading] = useState(false);
    const [showParentSelect, setShowParentSelect] = useState(false);
    const [availableParents, setAvailableParents] = useState([]);

    useEffect(() => {
        const fetchParents = async () => {
            if (type === 'substate' && mode === 'create') {
                // Para crear subestado, obtener solo los estados raíz
                try {
                    const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/templates?only_roots=true`);
                    const result = await response.json();

                    let rootTemplates = [];

                    // Extraer data de templates raíces
                    if (result.code === 1 && result.result) {
                        if (result.result.data && Array.isArray(result.result.data)) {
                            rootTemplates = result.result.data;
                        } else if (Array.isArray(result.result)) {
                            rootTemplates = result.result;
                        }
                    }

                    setAvailableParents(rootTemplates);
                } catch (error) {
                    console.error('Error fetching root templates:', error);
                    setAvailableParents([]);
                }
            } else {
                // Para otros casos, usar todos los templates del store
                await store_templates.getTemplates();
            }
        };

        fetchParents();
    }, [type, mode]);

    // Sincronizar availableParents con el store cuando no sea creación de subestado
    useEffect(() => {
        if (!(type === 'substate' && mode === 'create')) {
            setAvailableParents(store_templates.templates);
        }
    }, [store_templates.templates, type, mode]);

    useEffect(() => {
        if (mode === 'edit' && data) {
            // Parsear roles si viene como string JSON
            let parsedRoles = [];
            if (data.roles) {
                try {
                    parsedRoles = typeof data.roles === 'string'
                        ? JSON.parse(data.roles)
                        : data.roles;
                } catch (e) {
                    console.error('Error parsing roles:', e);
                    parsedRoles = [];
                }
            }

            setFormData({
                name: data.name || '',
                description: data.description || '',
                is_active: data.is_active !== undefined ? data.is_active : true,
                parent_ids: data.parent_ids || [],
                roles: parsedRoles,
                days_past_due_min: data.days_past_due_min !== undefined && data.days_past_due_min !== null ? data.days_past_due_min : null
            });
        } else if (mode === 'create' && type === 'substate' && stateId) {
            // Al crear subestado, preseleccionar el estado padre
            setFormData(prev => ({
                ...prev,
                parent_ids: [stateId]
            }));
        }
    }, [mode, data, type, stateId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleParentToggle = (parentId) => {
        setFormData(prev => {
            const isSelected = prev.parent_ids.includes(parentId);
            return {
                ...prev,
                parent_ids: isSelected
                    ? prev.parent_ids.filter(id => id !== parentId)
                    : [...prev.parent_ids, parentId]
            };
        });
    };

    const handleRoleToggle = (role) => {
        setFormData(prev => {
            const isSelected = prev.roles.includes(role);
            return {
                ...prev,
                roles: isSelected
                    ? prev.roles.filter(r => r !== role)
                    : [...prev.roles, role]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('El nombre es requerido');
            return;
        }

        setLoading(true);

        try {
            let url = '';
            let method = 'POST';
            let body = {
                name: formData.name,
                is_active: formData.is_active,
                parent_ids: mode === 'edit' ? (data.parent_ids || []) : formData.parent_ids
            };

            if (formData.description) {
                body.description = formData.description;
            }

            // Solo incluir roles y days_past_due_min para estados padre (type === 'state')
            if (type === 'state') {
                if (formData.roles && formData.roles.length > 0) {
                    body.roles = formData.roles;
                }
                if (formData.days_past_due_min !== null && formData.days_past_due_min !== '') {
                    body.days_past_due_min = parseInt(formData.days_past_due_min);
                }
            }

            if (mode === 'create') {
                url = `${import.meta.env.VITE_URL_BASE}/templates`;
            } else {
                url = `${import.meta.env.VITE_URL_BASE}/templates/${data.id}`;
                method = 'PATCH';
            }

            const response = await fetchWithAuth(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (response.ok && result.code === 1) {
                sendpush({
                    title: 'Éxito',
                    message: mode === 'create'
                        ? `${type === 'state' ? 'Estado' : 'Subestado'} creado correctamente`
                        : `${type === 'state' ? 'Estado' : 'Subestado'} actualizado correctamente`,
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                onSave();
            } else {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            sendpush({
                title: 'Error',
                message: error.message || `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el ${type === 'state' ? 'estado' : 'subestado'}`,
                type: 'Push--error',
                timeout: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const title = mode === 'create'
        ? `Crear ${type === 'state' ? 'Estado' : 'Subestado'}`
        : `Editar ${type === 'state' ? 'Estado' : 'Subestado'}`;

    return (
        <div className="CardEditTemplate">
            <h3 className="CardEditTemplate__title">{title}</h3>

            <form onSubmit={handleSubmit} className="CardEditTemplate__form">
                <div className="CardEditTemplate__field">
                    <label htmlFor="name">Nombre *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={`Nombre del ${type === 'state' ? 'estado' : 'subestado'}`}
                        required
                    />
                </div>

                {mode === 'edit' && (
                    <div className="CardEditTemplate__field">
                        <label className="CardEditTemplate__checkboxLabel">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            <span>Estado activo</span>
                        </label>
                    </div>
                )}

                {mode === 'edit' && type === 'state' && (
                    <>
                        <div className="CardEditTemplate__field">
                            <label>Roles permitidos</label>
                            <div className="CardEditTemplate__rolesContainer">
                                {['admin', 'supervisor', 'campo', 'call'].map((role) => (
                                    <label key={role} className="CardEditTemplate__roleOption">
                                        <input
                                            type="checkbox"
                                            checked={formData.roles.includes(role)}
                                            onChange={() => handleRoleToggle(role)}
                                        />
                                        <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="CardEditTemplate__field">
                            <label htmlFor="days_past_due_min">Días de mora mínimos</label>
                            <input
                                type="number"
                                id="days_past_due_min"
                                name="days_past_due_min"
                                value={formData.days_past_due_min || ''}
                                onChange={handleChange}
                                placeholder="Ej: 30"
                                min="0"
                            />
                        </div>
                    </>
                )}

                {mode === 'create' && (
                    <div className="CardEditTemplate__field">
                        <label>Estados padre (opcional)</label>
                        <div className="CardEditTemplate__parentSelect">
                            <button
                                type="button"
                                className="CardEditTemplate__parentBtn"
                                onClick={() => setShowParentSelect(!showParentSelect)}
                            >
                                {formData.parent_ids.length > 0
                                    ? `${formData.parent_ids.length} estado(s) seleccionado(s)`
                                    : 'Seleccionar estados padre'}
                            </button>
                            {showParentSelect && (
                                <div className="CardEditTemplate__parentOptions">
                                    {availableParents.map((template) => (
                                        <label key={template.id} className="CardEditTemplate__parentOption">
                                            <input
                                                type="checkbox"
                                                checked={formData.parent_ids.includes(template.id)}
                                                onChange={() => handleParentToggle(template.id)}
                                            />
                                            <span>{template.name}</span>
                                        </label>
                                    ))}
                                    {availableParents.length === 0 && (
                                        <p className="CardEditTemplate__noParents">No hay estados disponibles</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="CardEditTemplate__actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="CardEditTemplate__btnCancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="CardEditTemplate__btnSave"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
