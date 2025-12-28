import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./CardEditUser.css";
import useFetch from "../../hooks/useFetch";
import sendpush from "../../helpers/sendpush";

const permissionData = [
    {
        role: 'superadmin',
        permission: {
            sections: [
                { section: 'home', label: 'Dashboard' },
                { section: 'monitor', label: 'Monitoreo' },
                { section: 'consult', label: 'Consultas' },
                { section: 'directions', label: 'Direcciones' },
                { section: 'contacts', label: 'Contactos' },
                { section: 'management_historial', label: 'Historial de gestiones' },
                { section: 'management', label: 'Gestión' },
                { section: 'campains', label: 'Campañas' },
                { section: 'users', label: 'Usuarios' },
                { section: 'settings', label: 'Configuración' },
                { section: 'calls', label: 'Llamadas' },
                { section: 'payments', label: 'Pagos' }
            ]
        }
    },
    {
        role: 'admin',
        permission: {
            sections: [
                { section: 'home', label: 'Dashboard' },
                { section: 'monitor', label: 'Monitoreo' },
                { section: 'consult', label: 'Consultas' },
                { section: 'directions', label: 'Direcciones' },
                { section: 'contacts', label: 'Contactos' },
                { section: 'management_historial', label: 'Historial de gestiones' },
                { section: 'management', label: 'Gestión' },
                { section: 'campains', label: 'Campañas' },
                { section: 'users', label: 'Usuarios' },
                { section: 'settings', label: 'Configuración' },
                { section: 'calls', label: 'Llamadas' },
                { section: 'payments', label: 'Pagos' }
            ]
        }
    },
    {
        role: 'supervisor',
        permission: {
            sections: [
                { section: 'monitor', label: 'Monitoreo' },
                { section: 'consult', label: 'Consultas' },
                { section: 'directions', label: 'Direcciones' },
                { section: 'contacts', label: 'Contactos' },
                { section: 'management_historial', label: 'Historial de gestiones' },
                { section: 'management', label: 'Gestión' },
                { section: 'campains', label: 'Campañas' },
                { section: 'calls', label: 'Llamadas' },
                { section: 'payments', label: 'Pagos' }
            ]
        }
    },
    {
        role: 'campo',
        permission: {
            sections: [
                { section: 'contacts', label: 'Contactos' },
                { section: 'management', label: 'Gestión' },
                { section: 'calls', label: 'Llamadas' },
                { section: 'payments', label: 'Pagos' }
            ]
        }
    },
    {
        role: 'call',
        permission: {
            sections: [
                { section: 'contacts', label: 'Contactos' },
                { section: 'management', label: 'Gestión' },
                { section: 'calls', label: 'Llamadas' }
            ]
        }
    }
];

// Todas las secciones disponibles en el sistema
const allSections = [
    { section: 'home', label: 'Dashboard' },
    { section: 'monitor', label: 'Monitoreo' },
    { section: 'consult', label: 'Consultas' },
    { section: 'directions', label: 'Direcciones' },
    { section: 'contacts', label: 'Contactos' },
    { section: 'management_historial', label: 'Historial de gestiones' },
    { section: 'management', label: 'Gestión' },
    { section: 'campains', label: 'Campañas' },
    { section: 'users', label: 'Usuarios' },
    { section: 'settings', label: 'Configuración' },
    { section: 'calls', label: 'Llamadas' },
    { section: 'payments', label: 'Pagos' }
];

// Todas las habilidades disponibles por sección
const allAbilities = {
    home: ['home:view'],
    users: ['users:create', 'users:edit', 'users:delete', 'users:view'],
    settings: ['settings:edit'],
    calls: ['calls:create', 'calls:make', 'calls:view', 'calls:receive'],
    payments: ['payments:create', 'payments:edit', 'payments:delete', 'payments:view'],
    reports: ['reports:view', 'reports:export'],
    campains: ['campains:create', 'campains:edit', 'campains:delete', 'campains:view', 'campains:transfer'],
    management: ['management:create', 'management:edit', 'management:delete', 'management:view'],
    contacts: ['contacts:create', 'contacts:edit', 'contacts:delete', 'contacts:view'],
    directions: ['directions:create', 'directions:edit', 'directions:delete', 'directions:view'],
    monitor: ['monitor:view'],
    consult: ['consult:view'],
    management_historial: ['management_historial:view']
};

// Etiquetas legibles para las habilidades
const abilityLabels = {
    'view': 'Ver',
    'create': 'Crear',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'make': 'Realizar',
    'receive': 'Recibir',
    'export': 'Exportar',
    'transfer': 'Transferir'
};

export default function CardEditUser({ user = null, onClose, onSave }) {
    const { fetchWithAuth } = useFetch();
    const isCreating = !user || !user.id;

    const [userData, setUserData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        password: '',
        role: user?.role || 'call',
        extension: user?.extension || '',
        phone: user?.phone || '',
        customPermissions: []
    });

    const [useCustomPermissions, setUseCustomPermissions] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);
    const [selectedAbilities, setSelectedAbilities] = useState({});
    const [expandedSections, setExpandedSections] = useState({});
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Priorizar permisos personalizados del usuario si existen
        if (user && user.permission && user.permission !== '[]') {
            try {
                const customPermissions = typeof user.permission === 'string'
                    ? JSON.parse(user.permission)
                    : user.permission;

                if (Array.isArray(customPermissions) && customPermissions.length > 0) {
                    // Cargar secciones personalizadas
                    const customSections = customPermissions.map(perm => perm.section);
                    setSelectedSections(customSections);

                    // Cargar abilities personalizadas
                    const customAbilities = {};
                    customPermissions.forEach(perm => {
                        if (perm.abilities && Array.isArray(perm.abilities)) {
                            customAbilities[perm.section] = perm.abilities;
                        }
                    });
                    setSelectedAbilities(customAbilities);
                    setUseCustomPermissions(true);
                    console.log('✅ Loaded custom permissions for user:', user.id);
                    return;
                }
            } catch (error) {
                console.error('Error parsing user permissions:', error);
            }
        }

        // Fallback: Cargar permisos del rol
        const rolePermission = permissionData.find(p => p.role === (user?.role || 'call'));
        if (rolePermission) {
            setSelectedSections(rolePermission.permission.sections.map(s => s.section));

            // Cargar abilities por sección
            const abilities = {};
            if (rolePermission.permission.abilities) {
                rolePermission.permission.abilities.forEach(abilityGroup => {
                    abilities[abilityGroup.section] = abilityGroup.abilitie;
                });
            }
            setSelectedAbilities(abilities);
            setUseCustomPermissions(false);
            console.log('✅ Loaded role permissions for:', user?.role || 'call');
        }
    }, [user?.role, user?.permission]);

    const handleRoleChange = (newRole) => {
        setUserData({ ...userData, role: newRole });

        // Actualizar secciones según el nuevo rol
        const rolePermission = permissionData.find(p => p.role === newRole);
        if (rolePermission) {
            setSelectedSections(rolePermission.permission.sections.map(s => s.section));

            // Actualizar abilities según el nuevo rol
            const abilities = {};
            if (rolePermission.permission.abilities) {
                rolePermission.permission.abilities.forEach(abilityGroup => {
                    abilities[abilityGroup.section] = abilityGroup.abilitie;
                });
            }
            setSelectedAbilities(abilities);
        }
    };

    const toggleAbility = (sectionName, ability) => {
        setUseCustomPermissions(true);
        const currentAbilities = selectedAbilities[sectionName] || [];

        if (currentAbilities.includes(ability)) {
            setSelectedAbilities({
                ...selectedAbilities,
                [sectionName]: currentAbilities.filter(a => a !== ability)
            });
        } else {
            setSelectedAbilities({
                ...selectedAbilities,
                [sectionName]: [...currentAbilities, ability]
            });
        }
    };

    const toggleSectionExpanded = (sectionName) => {
        setExpandedSections({
            ...expandedSections,
            [sectionName]: !expandedSections[sectionName]
        });
    };

    const toggleSection = (sectionName) => {
        setUseCustomPermissions(true);
        if (selectedSections.includes(sectionName)) {
            setSelectedSections(selectedSections.filter(s => s !== sectionName));
        } else {
            setSelectedSections([...selectedSections, sectionName]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setErrors({});

        try {
            // Preparar permisos en formato de array para el backend
            const permissionsArray = useCustomPermissions
                ? selectedSections.map(section => ({
                    section: section,
                    abilities: selectedAbilities[section] || []
                    }))
                : [];

            const requestData = {
                name: userData.name,
                username: userData.username,
                role: userData.role,
                extension: userData.extension || '',
                phone: userData.phone || '',
                permission: JSON.stringify(permissionsArray)
            };

            console.log(requestData)

            // Si es creación, agregar password
            if (isCreating) {
                requestData.password = userData.password;
            }

            const url = isCreating
                ? `${import.meta.env.VITE_URL_BASE}/users`
                : `${import.meta.env.VITE_URL_BASE}/users/${user.id}`;

            const method = isCreating ? 'POST' : 'PUT';

            const response = await fetchWithAuth(url, {
                method: method,
                body: new URLSearchParams(requestData)
            });

            const data = await response.json();

            // Verificar si hay errores de validación
            if (data.code === -1 && data.result) {
                setErrors(data.result);
                sendpush({
                    title: 'Errores de validación',
                    message: 'Por favor corrige los errores en el formulario.',
                    type: 'Push--warning',
                    timeout: 5000
                });
                return;
            }

            if (data.code === 1) {
                sendpush({
                    title: isCreating ? 'Usuario creado' : 'Usuario actualizado',
                    message: isCreating ? 'El usuario ha sido creado correctamente.' : 'El usuario ha sido actualizado correctamente.',
                    type: 'Push--sucessful',
                    timeout: 5000
                });
                onSave();
                onClose();
            } else {
                sendpush({
                    title: 'Error',
                    message: data.message || 'Error al guardar usuario',
                    type: 'Push--error',
                    timeout: 5000
                });
            }
        } catch (error) {
            console.error('Error saving user:', error);
            sendpush({
                title: 'Error',
                message: 'Error al guardar usuario',
                type: 'Push--error',
                timeout: 5000
            });
        } finally {
            setSaving(false);
        }
    };

    const modalContent = (
        <div className="CardEditUser__overlay" onClick={onClose}>
            <div className="CardEditUser" onClick={(e) => e.stopPropagation()}>
                <div className="CardEditUser__header">
                    <h2>{isCreating ? 'Crear Usuario' : `Editar Usuario #${user.id}`}</h2>
                    <button className="CardEditUser__close" onClick={onClose}>×</button>
                </div>

                <div className="CardEditUser__content">
                    <div className="CardEditUser__section">
                        <h3>Información del Usuario</h3>

                        <div className="CardEditUser__field">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && (
                                <span className="CardEditUser__error">{errors.name[0]}</span>
                            )}
                        </div>

                        <div className="CardEditUser__field">
                            <label>Correo electrónico / Usuario</label>
                            <input
                                type="text"
                                value={userData.username}
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                className={errors.username ? 'error' : ''}
                            />
                            {errors.username && (
                                <span className="CardEditUser__error">{errors.username[0]}</span>
                            )}
                            {errors.username && (
                                <span className="CardEditUser__error">{errors.username[0]}</span>
                            )}
                        </div>

                        {isCreating && (
                            <div className="CardEditUser__field">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    placeholder="Mínimo 6 caracteres"
                                    className={errors.password ? 'error' : ''}
                                />
                                {errors.password && (
                                    <span className="CardEditUser__error">{errors.password[0]}</span>
                                )}
                            </div>
                        )}

                        <div className="CardEditUser__field">
                            <label>Extensión VOIP</label>
                            <input
                                type="text"
                                value={userData.extension}
                                onChange={(e) => setUserData({ ...userData, extension: e.target.value })}
                                placeholder="Ej: SIP/1001"
                                className={errors.extension ? 'error' : ''}
                            />
                            {errors.extension && (
                                <span className="CardEditUser__error">{errors.extension[0]}</span>
                            )}
                        </div>

                        <div className="CardEditUser__field">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                value={userData.phone}
                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                placeholder="Ej: 0999123456"
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && (
                                <span className="CardEditUser__error">{errors.phone[0]}</span>
                            )}
                        </div>

                        <div className="CardEditUser__field">
                            <label>Rol</label>
                            <select
                                value={userData.role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className={errors.role ? 'error' : ''}
                            >
                                {localStorage.getItem('role') === 'superadmin' && (
                                    <option value="superadmin">Superadmin</option>
                                )}
                                <option value="admin">Administrador</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="call">Gestor | Call Center</option>
                                <option value="campo">Gestor | Campo</option>
                            </select>
                            {errors.role && (
                                <span className="CardEditUser__error">{errors.role[0]}</span>
                            )}
                        </div>
                    </div>

                    <div className="CardEditUser__section">
                        <h3>Permisos de Secciones</h3>

                        <div className="CardEditUser__permissions-info">
                            {useCustomPermissions ? (
                                <p className="info-custom">Usando permisos personalizados</p>
                            ) : (
                                <p className="info-role">Usando permisos del rol: <strong>{userData.role}</strong></p>
                            )}
                        </div>

                        <div className="CardEditUser__permissions-grid">
                            {allSections.map((section) => {
                                const isEnabled = selectedSections.includes(section.section);
                                const rolePermission = permissionData.find(p => p.role === userData.role);
                                const isInRole = rolePermission?.permission.sections.some(s => s.section === section.section);
                                const isExpanded = expandedSections[section.section];
                                const sectionAbilities = allAbilities[section.section] || [];
                                const currentAbilities = selectedAbilities[section.section] || [];

                                return (
                                    <div
                                        key={section.section}
                                        className={`CardEditUser__permission-item ${isEnabled ? 'enabled' : 'disabled'}`}
                                    >
                                        <div className="CardEditUser__permission-header">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={isEnabled}
                                                    onChange={() => toggleSection(section.section)}
                                                />
                                                <span>{section.label}</span>
                                                {!useCustomPermissions && isInRole && (
                                                    <span className="role-badge">Del rol</span>
                                                )}
                                            </label>
                                            {isEnabled && sectionAbilities.length > 0 && (
                                                <button
                                                    className="CardEditUser__expand-btn"
                                                    onClick={() => toggleSectionExpanded(section.section)}
                                                    type="button"
                                                >
                                                    {isExpanded ? '▼' : '▶'}
                                                </button>
                                            )}
                                        </div>

                                        {isEnabled && isExpanded && sectionAbilities.length > 0 && (
                                            <div className="CardEditUser__abilities">
                                                {sectionAbilities.map((ability) => {
                                                    const abilityName = ability.split(':')[1];
                                                    const abilityLabel = abilityLabels[abilityName] || abilityName;
                                                    const isAbilityEnabled = currentAbilities.includes(ability);

                                                    return (
                                                        <label key={ability} className="CardEditUser__ability-item">
                                                            <input
                                                                type="checkbox"
                                                                checked={isAbilityEnabled}
                                                                onChange={() => toggleAbility(section.section, ability)}
                                                            />
                                                            <span>{abilityLabel}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {useCustomPermissions && (
                            <button
                                className="CardEditUser__reset-permissions"
                                onClick={() => {
                                    setUseCustomPermissions(false);
                                    const rolePermission = permissionData.find(p => p.role === userData.role);
                                    if (rolePermission) {
                                        setSelectedSections(rolePermission.permission.sections.map(s => s.section));

                                        // Restaurar abilities del rol
                                        const abilities = {};
                                        if (rolePermission.permission.abilities) {
                                            rolePermission.permission.abilities.forEach(abilityGroup => {
                                                abilities[abilityGroup.section] = abilityGroup.abilitie;
                                            });
                                        }
                                        setSelectedAbilities(abilities);
                                    }
                                }}
                            >
                                Restaurar permisos del rol
                            </button>
                        )}
                    </div>
                </div>

                <div className="CardEditUser__footer">
                    <button className="CardEditUser__cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="CardEditUser__save"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : (isCreating ? 'Crear usuario' : 'Guardar cambios')}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
