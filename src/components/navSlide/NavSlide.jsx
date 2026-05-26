import { NavLink } from "react-router-dom";
import "./navSlide.css";
import useNav from "../../hooks/useNav.js";
import { useEffect, useRef, useState } from "react";
import useMenu from "../../hooks/useMenu.js";
import {
    LayoutDashboard,
    Monitor,
    Map,
    Search,
    Wallet,
    Navigation,
    UserRound,
    History,
    ClipboardCheck,
    Car,
    Megaphone,
    Users,
    FileSpreadsheet,
    TrendingUp,
    Settings,
    PhoneCall,
} from "lucide-react";

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
    { section: 'templates', label: 'Control de estados de gestión' },
    { section: 'businesses', label: 'Carteras' },
    { section: 'import_payments', label: 'Carga de pagos' },
    { section: 'cartera_update', label: 'Actualización cartera' },
    { section: 'calls', label: 'Llamadas' },
    { section: 'payments', label: 'Pagos' },
    { section: 'reports', label: 'Reportes' },
    { section: 'report_cash_payments', label: 'Pagos en efectivo' },
    { section: 'report_reversed_payments', label: 'Pagos revertidos' },
    { section: 'report_collection_billing', label: 'Facturación gastos de cobranza' },
    { section: 'report_condonations', label: 'Condonaciones' },
    { section: 'report_accounting_payments', label: 'Pagos contabilidad' },
    { section: 'report_legal_payments', label: 'Pagos proceso legal' },
    { section: 'report_judicial_expenses', label: 'Gastos judiciales cargados' },
    { section: 'report_agreement_status', label: 'Estado de convenios' },
    { section: 'report_payments_management', label: 'Pagos con gestión' },
    { section: 'report_faces_management', label: 'Reporte gestión FACES' },
    { section: 'report_portfolio_status', label: 'Estado de cartera (SEFIL)' },
    { section: 'report_credits_evolution', label: 'Evolución créditos y pagos (SEFIL)' },
    { section: 'report_campaign_assignment', label: 'Asignación de campaña' },
    { section: 'geogestion', label: 'Geogestión' },
    { section: 'field-trip', label: 'Módulo visita campo' },
    { section: 'recaudacion', label: 'Recaudación' },
    { section: 'certificados', label: 'Certificados' },
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
                { section: 'management_historial', abilitie: ['management_historial:view'] },
                { section: 'geogestion', abilitie: ['geogestion:view','geogestion:edit'] },
                { section: 'field-trip', abilitie: ['field-trip:view','field-trip:edit','field-trip:create','field-trip:delete'] },
                { section: 'recaudacion', abilitie: ['recaudacion:view'] },
                { section: 'cartera_update', abilitie: ['cartera_update:view', 'cartera_update:edit'] }
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
                { section: 'recaudacion', label: 'Recaudación' },
                { section: 'directions', label: 'Direcciones' },
                { section: 'contacts', label: 'Contactos' },
                { section: 'management_historial', label: 'Historial de gestiones' },
                { section: 'management', label: 'Gestión' },
                { section: 'campains', label: 'Campañas' },
                { section: 'users', label: 'Usuarios' },
                { section: 'settings', label: 'Configuración' },
                { section: 'cartera_update', label: 'Actualización cartera' },
                { section: 'calls', label: 'Llamadas' },
                { section: 'payments', label: 'Pagos' },
                { section: 'reports', label: 'Reportes' },
                { section: 'geogestion', label: 'Geogestión' },
                { section: 'field-trip', label: 'Módulo visita campo' }
            ],
            abilities: [
                { section: 'home', abilitie: ['home:view'] },
                { section: 'users', abilitie: ['users:create', 'users:view'] },
                { section: 'settings', abilitie: ['settings:edit'] },
                { section: 'cartera_update', abilitie: ['cartera_update:view', 'cartera_update:edit'] },
                { section: 'calls', abilitie: ['calls:create', 'calls:make', 'calls:view'] },
                { section: 'payments', abilitie: ['payments:create', 'payments:view'] },
                { section: 'reports', abilitie: ['reports:view', 'reports:export'] },
                { section: 'campains', abilitie: ['campains:create', 'campains:edit', 'campains:view'] },
                { section: 'management', abilitie: ['management:create', 'management:view'] },
                { section: 'contacts', abilitie: ['contacts:create', 'contacts:view'] },
                { section: 'directions', abilitie: ['directions:create', 'directions:view'] },
                { section: 'monitor', abilitie: ['monitor:view'] },
                { section: 'consult', abilitie: ['consult:view'] },
                { section: 'management_historial', abilitie: ['management_historial:view'] },
                { section: 'geogestion', abilitie: ['geogestion:view','geogestion:edit'] },
                { section: 'field-trip', abilitie: ['field-trip:view','field-trip:edit','field-trip:create','field-trip:delete'] },
                { section: 'recaudacion', abilitie: ['recaudacion:view'] }
            ]
        }
    },
    {
        role: 'supervisor',
        permission: {
            sections: [
                { section: 'monitor', label: 'Monitoreo' },
                { section: 'consult', label: 'Consultas' },
                { section: 'recaudacion', label: 'Recaudación' },
                { section: 'directions', label: 'Direcciones' },
                { section: 'contacts', label: 'Contactos' },
                { section: 'reports', abilitie: ['reports:view', 'reports:export'] },
                { section: 'management_historial', label: 'Historial de gestiones' },
                { section: 'management', label: 'Gestión' },
                { section: 'campains', label: 'Campañas' },
                { section: 'calls', label: 'Llamadas' },
                { section: 'payments', label: 'Pagos' },
                { section: 'geogestion', label: 'Geogestión' },
                { section: 'field-trip', label: 'Módulo visita campo' }

            ],
            abilities: [
                { section: 'calls', abilitie: ['calls:make', 'calls:receive'] },
                { section: 'payments', abilitie: ['payments:create', 'payments:view'] },
                { section: 'campains', abilitie: ['campains:view', 'campains:transfer'] },
                { section: 'management', abilitie: ['management:create', 'management:view'] },
                { section: 'contacts', abilitie: ['contacts:create', 'contacts:view'] },
                { section: 'directions', abilitie: ['directions:create', 'directions:view'] },
                { section: 'reports', abilitie: ['reports:view', 'reports:export'] },
                { section: 'monitor', abilitie: ['monitor:view'] },
                { section: 'consult', abilitie: ['consult:view'] },
                { section: 'management_historial', abilitie: ['management_historial:view'] },
                { section: 'geogestion', abilitie: ['geogestion:view','geogestion:edit'] },
                { section: 'field-trip', abilitie: ['field-trip:view','field-trip:edit','field-trip:create','field-trip:delete'] },
                { section: 'recaudacion', abilitie: ['recaudacion:view'] }
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
        role: 'legal',
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
    const menuSettings = useRef();
    const menuCashReports = useRef();
    const menuStatisticsReports = useRef();
    const menuRecaudacion = useRef();

    const [sections, setSections] = useState([]);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const userCustomPermissions = localStorage.getItem('user_permissions');

        if (userCustomPermissions && userCustomPermissions !== '[]') {
            try {
                const customPermissions = JSON.parse(userCustomPermissions);
                const userSections = customPermissions.map(perm => ({
                    section: perm.section,
                    label: allSections.find(s => s.section === perm.section)?.label || perm.section
                }));

                setSections(userSections);
            } catch (error) {
                console.error('Error parsing user permissions:', error);
                loadRolePermissions(role);
            }
        } else {
            loadRolePermissions(role);
        }
    }, []);

    const loadRolePermissions = (role) => {
        const userPermission = permissionData.find(p => p.role === role);

        if (userPermission) {
            setSections(userPermission.permission.sections);
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
                <img src="/icons/entypo_menu.png" onClick={(e) => { useNav(e) }} />
            </div>

            {hasSection('home') && (
                <NavLink to="/dashboard" className="NavSlide__option">
                    <LayoutDashboard size={22} />
                    <label>{getSectionLabel('home')}</label>
                    <span>{getSectionLabel('home')}</span>
                </NavLink>
            )}

            {hasSection('monitor') && (
                <NavLink to="/monitor" className="NavSlide__option">
                    <Monitor size={22} />
                    <label>{getSectionLabel('monitor')}</label>
                    <span>{getSectionLabel('monitor')}</span>
                </NavLink>
            )}

            {hasSection('geogestion') && (
                <NavLink to="/geogestion" className="NavSlide__option">
                    <Map size={22} />
                    <label>{getSectionLabel('geogestion')}</label>
                    <span>{getSectionLabel('geogestion')}</span>
                </NavLink>
            )}

            {hasSection('consult') && (
                <NavLink to="/consult" className="NavSlide__option">
                    <Search size={22} />
                    <label>{getSectionLabel('consult')}</label>
                    <span>{getSectionLabel('consult')}</span>
                </NavLink>
            )}

            {(hasSection('recaudacion') || hasSection('certificados')) && (
                <div className="NavSlide__option" onClick={(e) => { useMenu(e.target, menuRecaudacion, 'NavSlide__subOption--active', menuRecaudacion) }}>
                    <Wallet size={22} />
                    <label>Recaudación</label>
                    <span>Recaudación</span>
                    <div className="NavSlide__option--down">
                        <img src="/icons/arrowDown.png" />
                        <div ref={menuRecaudacion}>
                            {hasSection('recaudacion') && <NavLink to="/recaudacion">Recaudación</NavLink>}
                            {hasSection('certificados') && <NavLink to="/recaudacion/certificados">Certificados</NavLink>}
                        </div>
                    </div>
                </div>
            )}

            {hasSection('directions') && (
                <NavLink to="/directions" className="NavSlide__option">
                    <Navigation size={22} />
                    <label>{getSectionLabel('directions')}</label>
                    <span>{getSectionLabel('directions')}</span>
                </NavLink>
            )}

            {hasSection('contacts') && (
                <NavLink to="/contacts-consult" className="NavSlide__option">
                    <UserRound size={22} />
                    <label>{getSectionLabel('contacts')}</label>
                    <span>{getSectionLabel('contacts')}</span>
                </NavLink>
            )}

            {hasSection('management_historial') && (
                <NavLink to="/managements-historial" className="NavSlide__option">
                    <History size={22} />
                    <label>{getSectionLabel('management_historial')}</label>
                    <span>{getSectionLabel('management_historial')}</span>
                </NavLink>
            )}

            {['admin', 'superadmin', 'supervisor'].includes(localStorage.getItem('role')) && (
                <NavLink to="/calls" className="NavSlide__option">
                    <PhoneCall size={22} />
                    <label>Historial de llamadas</label>
                    <span>Historial de llamadas</span>
                </NavLink>
            )}

            {hasSection('management') && (
                <NavLink to="/management" className="NavSlide__option">
                    <ClipboardCheck size={22} />
                    <label>{getSectionLabel('management')}</label>
                    <span>{getSectionLabel('management')}</span>
                </NavLink>
            )}

            {hasSection('field-trip') && (
                <NavLink to="/field-trip" className="NavSlide__option">
                    <Car size={22} />
                    <label>{getSectionLabel('field-trip')}</label>
                    <span>{getSectionLabel('field-trip')}</span>
                </NavLink>
            )}

            {hasSection('campains') && (
                <NavLink to="/campains" className="NavSlide__option">
                    <Megaphone size={22} />
                    <label>{getSectionLabel('campains')}</label>
                    <span>{getSectionLabel('campains')}</span>
                </NavLink>
            )}

            {hasSection('users') && (
                <NavLink to="/users" className="NavSlide__option">
                    <Users size={22} />
                    <label>{getSectionLabel('users')}</label>
                    <span>{getSectionLabel('users')}</span>
                </NavLink>
            )}

            {(hasSection('reports') || hasSection('report_cash_payments') || hasSection('report_reversed_payments') || hasSection('report_collection_billing') || hasSection('report_condonations') || hasSection('report_accounting_payments') || hasSection('report_legal_payments')) && (
                <div className="NavSlide__option" onClick={(e) => { useMenu(e.target, menuCashReports, 'NavSlide__subOption--active', menuCashReports) }}>
                    <FileSpreadsheet size={22} />
                    <label>Reportes cierre de caja</label>
                    <span>Reportes cierre de caja</span>
                    <div className="NavSlide__option--down">
                        <img src="/icons/arrowDown.png" />
                        <div ref={menuCashReports}>
                            {(hasSection('reports') || hasSection('report_cash_payments')) && <NavLink to={"/reports/cash-payments"}>Pagos en efectivo</NavLink>}
                            {(hasSection('reports') || hasSection('report_reversed_payments')) && <NavLink to={"/reports/reversed-payments"}>Pagos revertidos</NavLink>}
                            {(hasSection('reports') || hasSection('report_collection_billing')) && <NavLink to={"/reports/collection-expenses-billing"}>Facturación gastos de cobranza</NavLink>}
                            {(hasSection('reports') || hasSection('report_condonations')) && <NavLink to={"/reports/condonations"}>Condonaciones</NavLink>}
                            {(hasSection('reports') || hasSection('report_accounting_payments')) && <NavLink to={"/reports/accounting-payments"}>Pagos contabilidad</NavLink>}
                            {(hasSection('reports') || hasSection('report_legal_payments')) && <NavLink to={"/reports/legal-payments"}>Pagos proceso legal</NavLink>}
                        </div>
                    </div>
                </div>
            )}

            {(hasSection('reports') || hasSection('report_judicial_expenses') || hasSection('report_agreement_status') || hasSection('report_payments_management') || hasSection('report_faces_management') || hasSection('report_portfolio_status') || hasSection('report_credits_evolution') || hasSection('report_campaign_assignment')) && (
                <div className="NavSlide__option" onClick={(e) => { useMenu(e.target, menuStatisticsReports, 'NavSlide__subOption--active', menuStatisticsReports) }}>
                    <TrendingUp size={22} />
                    <label>Reportes estadísticas</label>
                    <span>Reportes estadísticas</span>
                    <div className="NavSlide__option--down">
                        <img src="/icons/arrowDown.png" />
                        <div ref={menuStatisticsReports}>
                            {(hasSection('reports') || hasSection('report_judicial_expenses')) && <NavLink to={"/reports/judicial-expenses"}>Gastos judiciales cargados</NavLink>}
                            {(hasSection('reports') || hasSection('report_agreement_status')) && <NavLink to={"/reports/agreement-status"}>Estado de convenios</NavLink>}
                            {(hasSection('reports') || hasSection('report_payments_management')) && <NavLink to={"/reports/payments-with-management"}>Pagos con gestión</NavLink>}
                            {(hasSection('reports') || hasSection('report_faces_management')) && <NavLink to={"/reports/faces-management"}>Reporte gestión FACES</NavLink>}
                            {(hasSection('reports') || hasSection('report_portfolio_status')) && <NavLink to={"/reports/portfolio-status"}>Estado de cartera (SEFIL)</NavLink>}
                            {(hasSection('reports') || hasSection('report_credits_evolution')) && <NavLink to={"/reports/credits-payments-evolution"}>Evolución créditos y pagos (SEFIL)</NavLink>}
                            {(hasSection('reports') || hasSection('report_campaign_assignment')) && <NavLink to={"/reports/campaign-assignment"}>Asignación de campaña</NavLink>}
                        </div>
                    </div>
                </div>
            )}

            {(hasSection('settings') || hasSection('templates') || hasSection('businesses') || hasSection('import_payments') || hasSection('cartera_update')) && (
                <div className="NavSlide__option" onClick={(e) => { useMenu(e.target, menuSettings, 'NavSlide__subOption--active', menuSettings) }}>
                    <Settings size={22} />
                    <label>Configuración</label>
                    <span>Configuración</span>
                    <div className="NavSlide__option--down">
                        <img src="/icons/arrowDown.png" />
                        <div ref={menuSettings}>
                            {(hasSection('settings') || hasSection('templates')) && <NavLink to={"/templates"}>Control de estados de gestión</NavLink>}
                            {(hasSection('settings') || hasSection('businesses')) && <NavLink to={"/businesses"}>Carteras</NavLink>}
                            {(hasSection('settings') || hasSection('import_payments')) && <NavLink to={"/import-payments"}>Carga de pagos</NavLink>}
                            {hasSection('cartera_update') && <NavLink to={"/update-cartera"}>Actualización cartera</NavLink>}
                        </div>
                    </div>
                </div>
            )}


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