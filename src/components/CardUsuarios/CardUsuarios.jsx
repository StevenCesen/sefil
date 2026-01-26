import { useRef, useState } from "react";
import "./CardUsuarios.css";
import useMenu from "../../hooks/useMenu";
import CardEditUser from "../CardEditUser/CardEditUser";

const roleLabels = {
    'superadmin': 'Superadmin',
    'admin': 'Administrador',
    'supervisor': 'Supervisor',
    'call': 'Gestor | Call Center',
    'campo': 'Gestor | Campo'
};

export default function CardUsuarios({ id, name, email, rol, extension, phone, permission, setChange, onUserUpdated }) {
    const menu = useRef();
    const [currentRole, setCurrentRole] = useState(rol);
    const [isEditing, setIsEditing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const hasCustomPermissions = permission && permission !== '[]';
    const permissionLabel = hasCustomPermissions ? 'Personalizados' : 'Basado en rol';

    return (
        <>
            <div className="CardUsuarios">
                <span data-id={id} className="CardUsuario__id">{id}</span>
                <span>{name}</span>
                <span>{email}</span>
                <span>
                    {isEditing ? (
                        <select
                            value={currentRole}
                            onChange={(e) => {
                                setCurrentRole(e.target.value);
                                setChange(true);
                            }}
                        >
                            {
                                (localStorage.getItem('role') === 'superadmin') &&
                                <option value="superadmin">Superadmin</option>
                            }
                            <option value="admin">Administrador</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="call">Gestor | Call Center</option>
                            <option value="campo">Gestor | Campo</option>
                        </select>
                    ) : (
                        roleLabels[currentRole] || currentRole
                    )}
                </span>
                <span className="CardUsuarios__list">
                    {isEditing ? 'Editando rol...' : permissionLabel}
                </span>

                <div className="CardUsuarios__menu">
                    <img src="./icons/options.png" onClick={(e) => { useMenu(e.target, menu, 'CardUsuarios__actions--active', null) }} />
                    <div ref={menu} className="CardUsuarios__actions">
                        <button
                            onClick={() => {
                                setShowEditModal(true);
                            }}
                        >
                            Editar usuario
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(!isEditing);
                            }}
                        >
                            {isEditing ? 'Cancelar edición' : 'Editar rol'}
                        </button>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <CardEditUser
                    user={{
                        id,
                        name,
                        username: email,
                        role: currentRole,
                        extension: extension,
                        phone: phone,
                        permission: permission
                    }}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => {
                        if (onUserUpdated) {
                            onUserUpdated();
                        }
                    }}
                />
            )}
        </>
    );
}
