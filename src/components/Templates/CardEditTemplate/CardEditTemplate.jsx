import { useState, useEffect } from "react";
import "./CardEditTemplate.css";
import useFetch from "../../../hooks/useFetch";

export default function CardEditTemplate({ type, mode, data, stateId, onSave, onClose }) {
    const { fetchWithAuth } = useFetch();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData({
                name: data.name || '',
                description: data.description || ''
            });
        }
    }, [mode, data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            let body = new URLSearchParams();

            if (type === 'state') {
                if (mode === 'create') {
                    url = `${import.meta.env.VITE_URL_BASE}/management-states`;
                } else {
                    url = `${import.meta.env.VITE_URL_BASE}/management-states/${data.id}`;
                    method = 'PUT';
                }
                body.append('name', formData.name);
                body.append('description', formData.description);
            } else {
                if (mode === 'create') {
                    url = `${import.meta.env.VITE_URL_BASE}/management-substates`;
                    body.append('state_id', stateId);
                } else {
                    url = `${import.meta.env.VITE_URL_BASE}/management-substates/${data.id}`;
                    method = 'PUT';
                }
                body.append('name', formData.name);
                body.append('description', formData.description);
            }

            const response = await fetchWithAuth(url, {
                method,
                body
            });

            if (response.ok) {
                alert(
                    mode === 'create'
                        ? `${type === 'state' ? 'Estado' : 'Subestado'} creado correctamente`
                        : `${type === 'state' ? 'Estado' : 'Subestado'} actualizado correctamente`
                );
                onSave();
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            alert(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} el ${type === 'state' ? 'estado' : 'subestado'}`);
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

                <div className="CardEditTemplate__field">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Descripción opcional"
                        rows="4"
                    />
                </div>

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
