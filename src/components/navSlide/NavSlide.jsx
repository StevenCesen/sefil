import { NavLink } from "react-router-dom";
import "./navSlide.css";
import useNav from "../../hooks/useNav.js";
import { useEffect, useRef, useState } from "react";
import useMenu from "../../hooks/useMenu.js";

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

const permissionData = [
    {
        role: 'superadmin',
        permission: {
            sections: allSections,
            abilities: [
                { section: 'home', abilitie: ['home:view'] },
                { section: 'users', abilitie: ['users:create', 'users:edit', 'users:delete', 'users:view'] },
                { section: 'settings', abilitie: ['settings:edit'] },
                { section: 'calls', abilitie: ['calls:create', 'calls:make', 'calls:view'] },
                { section: 'payments', abilitie: ['payments:create', 'payments:edit', 'payments:delete', 'payments:view'] },
                { section: 'reports', abilitie: ['reports:view', 'reports:export'] },
                { section: 'campains', abilitie: ['campains:create', 'campains:edit', 'campains:delete', 'campains:view'] },
                { section: 'management', abilitie: ['management:create', 'management:edit', 'management:delete', 'management:view'] },
                { section: 'contacts', abilitie: ['contacts:create', 'contacts:edit', 'contacts:delete', 'contacts:view'] },
                { section: 'directions', abilitie: ['directions:create', 'directions:edit', 'directions:delete', 'directions:view'] },
                { section: 'monitor', abilitie: ['monitor:view'] },
                { section: 'consult', abilitie: ['consult:view'] },
                { section: 'management_historial', abilitie: ['management_historial:view'] }
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
            ],
            abilities: [
                { section: 'home', abilitie: ['home:view'] },
                { section: 'users', abilitie: ['users:create', 'users:view'] },
                { section: 'settings', abilitie: ['settings:edit'] },
                { section: 'calls', abilitie: ['calls:create', 'calls:make', 'calls:view'] },
                { section: 'payments', abilitie: ['payments:create', 'payments:view'] },
                { section: 'reports', abilitie: ['reports:view', 'reports:export'] },
                { section: 'campains', abilitie: ['campains:create', 'campains:edit', 'campains:view'] },
                { section: 'management', abilitie: ['management:create', 'management:view'] },
                { section: 'contacts', abilitie: ['contacts:create', 'contacts:view'] },
                { section: 'directions', abilitie: ['directions:create', 'directions:view'] },
                { section: 'monitor', abilitie: ['monitor:view'] },
                { section: 'consult', abilitie: ['consult:view'] },
                { section: 'management_historial', abilitie: ['management_historial:view'] }
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
            ],
            abilities: [
                { section: 'calls', abilitie: ['calls:make', 'calls:receive'] },
                { section: 'payments', abilitie: ['payments:create', 'payments:view'] },
                { section: 'campains', abilitie: ['campains:view', 'campains:transfer'] },
                { section: 'management', abilitie: ['management:create', 'management:view'] },
                { section: 'contacts', abilitie: ['contacts:create', 'contacts:view'] },
                { section: 'directions', abilitie: ['directions:create', 'directions:view'] },
                { section: 'monitor', abilitie: ['monitor:view'] },
                { section: 'consult', abilitie: ['consult:view'] },
                { section: 'management_historial', abilitie: ['management_historial:view'] }
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
            ],
            abilities: [
                { section: 'calls', abilitie: ['calls:view'] },
                { section: 'payments', abilitie: ['payments:view'] },
                { section: 'management', abilitie: ['management:create', 'management:view'] },
                { section: 'contacts', abilitie: ['contacts:create', 'contacts:view'] }
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
            ],
            abilities: [
                { section: 'calls', abilitie: ['calls:view'] },
                { section: 'management', abilitie: ['management:create', 'management:view'] },
                { section: 'contacts', abilitie: ['contacts:create', 'contacts:view'] }
            ]
        }
    }
];

export default function NavSlide() {
    const menu = useRef();

    const [sections, setSections] = useState([]);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const userCustomPermissions = localStorage.getItem('user_permissions');

        // Priorizar permisos personalizados del usuario
        if (userCustomPermissions && userCustomPermissions !== '[]') {
            try {
                const customPermissions = JSON.parse(userCustomPermissions);

                // Convertir formato de permisos a formato de secciones
                const userSections = customPermissions.map(perm => ({
                    section: perm.section,
                    label: allSections.find(s => s.section === perm.section)?.label || perm.section
                }));

                setSections(userSections);
                console.log('✅ Using custom user permissions');
            } catch (error) {
                console.error('Error parsing user permissions:', error);
                // Fallback a permisos del rol
                loadRolePermissions(role);
            }
        } else {
            // Usar permisos del rol
            loadRolePermissions(role);
        }
    }, []);

    const loadRolePermissions = (role) => {
        const userPermission = permissionData.find(p => p.role === role);

        if (userPermission) {
            setSections(userPermission.permission.sections);
            console.log('✅ Using role permissions for:', role);
        } else {
            console.log('⚠️ No permissions found for role:', role);
        }
    };

    const hasSection = (sectionName) => {
        return sections.some(s => s.section === sectionName);
    };

    const getSectionLabel = (sectionName) => {
        const section = sections.find(s => s.section === sectionName);
        return section ? section.label : '';
    };

    return (
        <div className="Dashboard__navSlide">
            <div>
                <img src="./icons/entypo_menu.png" onClick={(e) => { useNav(e) }} />
            </div>

            {hasSection('home') && (
                <NavLink to="/dashboard" className="NavSlide__option">
                    <img src="./icons/mdi_home.png" />
                    <label>{getSectionLabel('home')}</label>
                    <span>{getSectionLabel('home')}</span>
                </NavLink>
            )}

            {hasSection('monitor') && (
                <NavLink to="/monitor" className="NavSlide__option">
                    <img src="./icons/monitor.png" />
                    <label>{getSectionLabel('monitor')}</label>
                    <span>{getSectionLabel('monitor')}</span>
                </NavLink>
            )}

            {hasSection('consult') && (
                <NavLink to="/consult" className="NavSlide__option">
                    <img src="./icons/ic_round-search.png" />
                    <label>{getSectionLabel('consult')}</label>
                    <span>{getSectionLabel('consult')}</span>
                </NavLink>
            )}
            
            {hasSection('directions') && (
                <NavLink to="/directions" className="NavSlide__option">
                    <img src="./icons/location.png" />
                    <label>{getSectionLabel('directions')}</label>
                    <span>{getSectionLabel('directions')}</span>
                </NavLink>
            )}

            {hasSection('contacts') && (
                <NavLink to="/contacts-consult" className="NavSlide__option">
                    <img src="./icons/ph_user-bold.png" />
                    <label>{getSectionLabel('contacts')}</label>
                    <span>{getSectionLabel('contacts')}</span>
                </NavLink>
            )}

            {hasSection('management_historial') && (
                <NavLink to="/managements-historial" className="NavSlide__option">
                    <img src="./icons/ion_bar-chart.png" />
                    <label>{getSectionLabel('management_historial')}</label>
                    <span>{getSectionLabel('management_historial')}</span>
                </NavLink>
            )}

            {hasSection('management') && (
                <NavLink to="/management" className="NavSlide__option">
                    <img src="./icons/zoiper.png" />
                    <label>{getSectionLabel('management')}</label>
                    <span>{getSectionLabel('management')}</span>
                </NavLink>
            )}

            {hasSection('campains') && (
                <NavLink to="/campains" className="NavSlide__option">
                    <img src="./icons/ion_bar-chart.png" />
                    <label>{getSectionLabel('campains')}</label>
                    <span>{getSectionLabel('campains')}</span>
                </NavLink>
            )}

            {hasSection('users') && (
                <NavLink to="/users" className="NavSlide__option">
                    <img src="./icons/ph_user-bold.png" />
                    <label>{getSectionLabel('users')}</label>
                    <span>{getSectionLabel('users')}</span>
                </NavLink>
            )}

            {hasSection('settings') && (
                <div className="NavSlide__option" onClick={(e) => { useMenu(e.target, menu, 'NavSlide__subOption--active', menu) }}>
                    <img src={"./icons/mdi_database-cog.png"} />
                    <label>{getSectionLabel('settings')}</label>
                    <span>{getSectionLabel('settings')}</span>
                    <div className="NavSlide__option--down">
                        <img src="./icons/arrowDown.png" />
                        <div ref={menu}>
                            <NavLink to={"/businesses"}>Carteras</NavLink>
                            <NavLink to={"/import-payments"}>Carga de pagos</NavLink>
                        </div>
                    </div>
                </div>
            )}

            {/* {hasSection('calls') && (
                <NavLink to="/calls" className="NavSlide__option">
                    <img src="./icons/zoiper.png" />
                    <label>{getSectionLabel('calls')}</label>
                    <span>{getSectionLabel('calls')}</span>
                </NavLink>
            )} */}

            {/* {hasSection('payments') && (
                <NavLink to="/payments" className="NavSlide__option">
                    <img src="./icons/ion_bar-chart.png" />
                    <label>{getSectionLabel('payments')}</label>
                    <span>{getSectionLabel('payments')}</span>
                </NavLink>
            )} */}

        </div>
    );
}