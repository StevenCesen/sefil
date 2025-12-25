import { useState } from "react";
import "./CardTemplate.css";
import useFetch from "../../../hooks/useFetch";

export default function CardTemplate({ state, onEdit, onCreateSubstate, onEditSubstate, onRefresh }) {
    const { fetchWithAuth } = useFetch();
    const [showSubstates, setShowSubstates] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`¿Estás seguro de eliminar el estado "${state.name}"?`)) {
            return;
        }

        try {
            await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/management-states/${state.id}`, {
                method: 'DELETE'
            });
            alert('Estado eliminado correctamente');
            onRefresh();
        } catch (error) {
            console.error('Error deleting state:', error);
            alert('Error al eliminar el estado');
        }
    };

    const handleDeleteSubstate = async (substateId) => {
        if (!confirm('¿Estás seguro de eliminar este subestado?')) {
            return;
        }

        try {
            await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/management-substates/${substateId}`, {
                method: 'DELETE'
            });
            alert('Subestado eliminado correctamente');
            onRefresh();
        } catch (error) {
            console.error('Error deleting substate:', error);
            alert('Error al eliminar el subestado');
        }
    };

    const substates = state.substates || [];

    return (
        <>
            <div className="CardTemplate">
                <label>{state.id}</label>
                <label>{state.name}</label>
                <label>{state.description || 'Sin descripción'}</label>
                <label>
                    <button
                        className="CardTemplate__toggleSubstates"
                        onClick={() => setShowSubstates(!showSubstates)}
                    >
                        {substates.length} subestados {showSubstates ? '▲' : '▼'}
                    </button>
                    <button
                        className="CardTemplate__addSubstate"
                        onClick={() => onCreateSubstate(state)}
                    >
                        + Agregar
                    </button>
                </label>
                <div className="CardTemplate__actions">
                    <button onClick={() => onEdit(state)}>
                        <img title="Editar estado" src="./icons/edit.png" alt="Editar" />
                    </button>
                    <button onClick={handleDelete}>
                        <img title="Eliminar estado" src="./icons/delete.png" alt="Eliminar" />
                    </button>
                </div>
            </div>

            {showSubstates && substates.length > 0 && (
                <div className="CardTemplate__substates">
                    <div className="CardTemplate__substatesHead">
                        <p>ID</p>
                        <p>Nombre del Subestado</p>
                        <p>Descripción</p>
                        <p>Acciones</p>
                    </div>
                    {substates.map((substate, index) => (
                        <div key={substate.id || index} className="CardTemplate__substateItem">
                            <label>{substate.id}</label>
                            <label>{substate.name}</label>
                            <label>{substate.description || 'Sin descripción'}</label>
                            <div className="CardTemplate__actions">
                                <button onClick={() => onEditSubstate(state, substate)}>
                                    <img title="Editar subestado" src="./icons/edit.png" alt="Editar" />
                                </button>
                                <button onClick={() => handleDeleteSubstate(substate.id)}>
                                    <img title="Eliminar subestado" src="./icons/delete.png" alt="Eliminar" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
