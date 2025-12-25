import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import Loader from "../../components/Loader/loader";
import CardTemplate from "../../components/Templates/CardTemplate/CardTemplate";
import CardEditTemplate from "../../components/Templates/CardEditTemplate/CardEditTemplate";
import useFetch from "../../hooks/useFetch";
import "./Templates.css";

const MODAL_TYPES = {
    CREATE_STATE: 'create_state',
    EDIT_STATE: 'edit_state',
    CREATE_SUBSTATE: 'create_substate',
    EDIT_SUBSTATE: 'edit_substate'
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="CardPay">
            <button
                className="CardCondonacion__close"
                onClick={onClose}
            >
                {title}
            </button>
            {children}
        </div>
    );
};

export default function Templates() {
    const { fetchWithAuth } = useFetch();
    const [activeModal, setActiveModal] = useState(null);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedSubstate, setSelectedSubstate] = useState(null);
    const [loading, setLoading] = useState(true);

    const closeModal = useCallback(() => {
        setActiveModal(null);
        setSelectedState(null);
        setSelectedSubstate(null);
    }, []);

    const openModal = useCallback((type, state = null, substate = null) => {
        setActiveModal(type);
        setSelectedState(state);
        setSelectedSubstate(substate);
    }, []);

    const fetchStates = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/management-states`);
            const data = await response.json();

            console.log('Estados obtenidos:', data);

            if (data.result && data.result.data && Array.isArray(data.result.data)) {
                setStates(data.result.data);
            } else if (Array.isArray(data)) {
                setStates(data);
            } else if (data.data && Array.isArray(data.data)) {
                setStates(data.data);
            } else {
                setStates([]);
            }
        } catch (error) {
            console.error('Error fetching states:', error);
            setStates([]);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);

    useEffect(() => {
        fetchStates();
    }, []);

    const handleCreateState = () => {
        openModal(MODAL_TYPES.CREATE_STATE);
    };

    const handleEditState = (state) => {
        openModal(MODAL_TYPES.EDIT_STATE, state);
    };

    const handleCreateSubstate = (state) => {
        openModal(MODAL_TYPES.CREATE_SUBSTATE, state);
    };

    const handleEditSubstate = (state, substate) => {
        openModal(MODAL_TYPES.EDIT_SUBSTATE, state, substate);
    };

    const handleSave = () => {
        fetchStates();
        closeModal();
    };

    if (loading) return <Loader />;

    return (
        <div className="pageTemplates">
            <div className="pageTemplates__head">
                <NavLink
                    to=""
                    onClick={(e) => {
                        e.preventDefault();
                        window.history.go(-1);
                    }}
                >
                    Regresar
                </NavLink>
            </div>

            <div className="pageTemplates__content">
                <h3 className="pageTemplates__title">Gestión de Estados y Subestados</h3>

                <div className="pageTemplates__list">
                    <div className="pageTemplates__access">
                        <h4 className="pageTemplates__subtitle">Estados de Gestión</h4>
                        <button onClick={handleCreateState}>
                            Nuevo Estado
                        </button>
                    </div>

                    <div className="pageTemplates__tableHead">
                        <p>ID</p>
                        <p>Nombre del Estado</p>
                        <p>Descripción</p>
                        <p>Subestados</p>
                        <p>Acciones</p>
                    </div>

                    <div className="pageTemplates__items">
                        {states.length > 0 ? (
                            states.map((state, index) => (
                                <CardTemplate
                                    key={state.id || index}
                                    state={state}
                                    onEdit={handleEditState}
                                    onCreateSubstate={handleCreateSubstate}
                                    onEditSubstate={handleEditSubstate}
                                    onRefresh={fetchStates}
                                />
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No hay estados registrados
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={activeModal === MODAL_TYPES.CREATE_STATE}
                onClose={closeModal}
                title="Volver"
            >
                <CardEditTemplate
                    type="state"
                    mode="create"
                    onSave={handleSave}
                    onClose={closeModal}
                />
            </Modal>

            <Modal
                isOpen={activeModal === MODAL_TYPES.EDIT_STATE}
                onClose={closeModal}
                title="Volver"
            >
                {selectedState && (
                    <CardEditTemplate
                        type="state"
                        mode="edit"
                        data={selectedState}
                        onSave={handleSave}
                        onClose={closeModal}
                    />
                )}
            </Modal>

            <Modal
                isOpen={activeModal === MODAL_TYPES.CREATE_SUBSTATE}
                onClose={closeModal}
                title="Volver"
            >
                {selectedState && (
                    <CardEditTemplate
                        type="substate"
                        mode="create"
                        stateId={selectedState.id}
                        onSave={handleSave}
                        onClose={closeModal}
                    />
                )}
            </Modal>

            <Modal
                isOpen={activeModal === MODAL_TYPES.EDIT_SUBSTATE}
                onClose={closeModal}
                title="Volver"
            >
                {selectedState && selectedSubstate && (
                    <CardEditTemplate
                        type="substate"
                        mode="edit"
                        stateId={selectedState.id}
                        data={selectedSubstate}
                        onSave={handleSave}
                        onClose={closeModal}
                    />
                )}
            </Modal>
        </div>
    );
}
