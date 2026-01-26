import { useState } from "react";
import "./CardTemplate.css";
import useFetch from "../../../hooks/useFetch";
import sendpush from "../../../helpers/sendpush";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog";

export default function CardTemplate({ state, onEdit, onCreateSubstate, onEditSubstate, onRefresh }) {
    const { fetchWithAuth } = useFetch();
    const [showSubstates, setShowSubstates] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, data: null });

    const handleDeleteClick = () => {
        setConfirmDialog({
            isOpen: true,
            type: 'delete_state',
            data: state
        });
    };

    const handleDelete = async () => {
        setConfirmDialog({ isOpen: false, type: null, data: null });

        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/templates/${state.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: state.name,
                    is_active: false,
                    parent_ids: state.parent_ids || []
                })
            });

            const result = await response.json();

            if (response.ok && result.code === 1) {
                sendpush({
                    title: 'Éxito',
                    message: 'Estado desactivado correctamente',
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                onRefresh();
            } else {
                throw new Error(result.message || 'Error al desactivar');
            }
        } catch (error) {
            console.error('Error deactivating state:', error);
            sendpush({
                title: 'Error',
                message: error.message || 'Error al desactivar el estado',
                type: 'Push--error',
                timeout: 3000
            });
        }
    };

    const handleDeleteSubstateClick = (substateId, substateName, substateParentIds) => {
        setConfirmDialog({
            isOpen: true,
            type: 'delete_substate',
            data: { id: substateId, name: substateName, parent_ids: substateParentIds }
        });
    };

    const handleDeleteSubstate = async () => {
        setConfirmDialog({ isOpen: false, type: null, data: null });

        const { id: substateId, name: substateName, parent_ids: substateParentIds } = confirmDialog.data;

        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/templates/${substateId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: substateName,
                    is_active: false,
                    parent_ids: substateParentIds || []
                })
            });

            const result = await response.json();

            if (response.ok && result.code === 1) {
                sendpush({
                    title: 'Éxito',
                    message: 'Subestado desactivado correctamente',
                    type: 'Push--sucessful',
                    timeout: 3000
                });
                onRefresh();
            } else {
                throw new Error(result.message || 'Error al desactivar');
            }
        } catch (error) {
            console.error('Error deactivating substate:', error);
            sendpush({
                title: 'Error',
                message: error.message || 'Error al desactivar el subestado',
                type: 'Push--error',
                timeout: 3000
            });
        }
    };

    const children = state.children || [];

    return (
        <>
            <div className="CardTemplate">
                <label>{state.id}</label>
                <label>{state.name}</label>
                <label>
                    <span className={`CardTemplate__status ${state.is_active ? 'active' : 'inactive'}`}>
                        {state.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                </label>
                <label>
                    <button
                        className="CardTemplate__toggleSubstates"
                        onClick={() => setShowSubstates(!showSubstates)}
                    >
                        {children.length} hijo(s) {showSubstates ? '▲' : '▼'}
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
                        <img title="Editar estado" src="/icons/edit.png" alt="Editar" />
                    </button>
                    <button onClick={handleDeleteClick}>
                        <img title="Desactivar estado" src="/icons/delete.png" alt="Desactivar" />
                    </button>
                </div>
            </div>

            {showSubstates && children.length > 0 && (
                <div className="CardTemplate__substates">
                    <div className="CardTemplate__substatesHead">
                        <p>ID</p>
                        <p>Nombre</p>
                        <p>Estado</p>
                        <p>Acciones</p>
                    </div>
                    {children.map((child, index) => (
                        <div key={child.id || index} className="CardTemplate__substateItem">
                            <label>{child.id}</label>
                            <label>{child.name}</label>
                            <label>
                                <span className={`CardTemplate__status ${child.is_active ? 'active' : 'inactive'}`}>
                                    {child.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </label>
                            <div className="CardTemplate__actions">
                                <button onClick={() => onEditSubstate(state, child)}>
                                    <img title="Editar" src="/icons/edit.png" alt="Editar" />
                                </button>
                                <button onClick={() => handleDeleteSubstateClick(child.id, child.name, child.parent_ids)}>
                                    <img title="Desactivar" src="/icons/delete.png" alt="Desactivar" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Confirmar desactivación"
                message={
                    confirmDialog.type === 'delete_state'
                        ? `¿Estás seguro de desactivar el estado "${confirmDialog.data?.name}"?`
                        : `¿Estás seguro de desactivar este subestado?`
                }
                onConfirm={confirmDialog.type === 'delete_state' ? handleDelete : handleDeleteSubstate}
                onCancel={() => setConfirmDialog({ isOpen: false, type: null, data: null })}
            />
        </>
    );
}
