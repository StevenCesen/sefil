import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import CardSync from "../components/CardSync/CardSync";
import CardEditCampain from "../components/Campains/CardEdirCampain/CardEditCampain";
import CardAssignCampain from "../components/Campains/CardAssignCampain/CardAssignCampain";
import CardCreateCampain from "../components/Campains/CardCreateCampain/CardCreateCampain";

const MODAL_TYPES = {
    CREATE: 'create',
    EDIT: 'edit', 
    TRANSFER: 'transfer'
};

const CampaignItem = ({ campaign, onEdit, onTransfer, onExport }) => (
    <div className="Campain__item">
        <label>{campaign.name}</label>
        <label>{campaign.state}</label>
        <label>{campaign.fecha_init}</label>
        <label>{campaign.fecha_finish}</label>
        {campaign.state !== 'FINALIZADA' && (
            <div>
                <button onClick={() => onEdit(campaign)}>
                    <img title="Editar campaña" src="./icons/edit.png" alt="Editar"/>
                </button>
                <button onClick={() => onTransfer(campaign)}>
                    <img title="Asignar campaña" src="./icons/transfer.png" alt="Asignar"/>
                </button>
                <button onClick={() => onExport(campaign)}>
                    <img title="Exportar campaña" src="./icons/expor.png" alt="Exportar"/>
                </button>
            </div>
        )}
    </div>
);

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

export default function Campain() {
    const [activeModal, setActiveModal] = useState(null);
    const [campaigns, setCampaigns] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    const closeModal = useCallback(() => {
        setActiveModal(null);
        setSelectedCampaign(null);
    }, []);

    const openModal = useCallback((type, campaign = null) => {
        setActiveModal(type);
        setSelectedCampaign(campaign);
    }, []);

    const updateCampaign = useCallback((newCampaign) => {
        setCampaigns(prev => ({
            ...prev,
            data: [...prev.data, newCampaign]
        }));
        closeModal();
    }, [closeModal]);

    const updateCreditsCampaign = useCallback((updatedCampaign) => {
        setCampaigns(prev => ({
            ...prev,
            data: prev.data.map(campaign => 
                campaign.id === updatedCampaign.id ? updatedCampaign : campaign
            )
        }));
    }, []);

    const handleEdit = useCallback((campaign) => {
        openModal(MODAL_TYPES.EDIT, campaign);
    }, [openModal]);

    const handleTransfer = useCallback((campaign) => {
        openModal(MODAL_TYPES.TRANSFER, campaign);
    }, [openModal]);

    const handleExport = useCallback((campaign) => {
        console.log('Exportar campaña:', campaign);
    }, []);

    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/campains`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCampaigns(data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    if (loading || !campaigns) {
        return <div>Cargando...</div>;
    }

    const activeCampaigns = campaigns.data?.filter(campaign => campaign.state === "ACTIVA") || [];

    return (
        <div className="pageConsulta">
            <div className="DetailCredit__head">
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

            <div className="Campain__content">
                <h3 className="Campain__title">Creación y asignación de campaña</h3>
                
                <div className="Campain__sincronice">
                    <h4 className="Campain__subtitle">Sincronización</h4>
                    <div>
                        <CardSync/>
                    </div>
                </div>
                    
                <div className="Campain__list">
                    <div className="Campain__access">
                        <h4 className="Campain__subtitle">Campañas</h4>
                        <button onClick={() => openModal(MODAL_TYPES.CREATE)}>
                            Nueva campaña
                        </button>
                    </div>

                    <div className="Campain__head">
                        <label>Nombre</label>
                        <label>Estado</label>
                        <label>Fecha de inicio</label>
                        <label>Fecha de fin</label>
                        <label>Acciones</label>
                    </div>

                    <div className="Campain__items">
                        {activeCampaigns.length > 0 ? (
                            activeCampaigns.map((campaign, index) => (
                                <CampaignItem
                                    key={campaign.id || index}
                                    campaign={campaign}
                                    onEdit={handleEdit}
                                    onTransfer={handleTransfer}
                                    onExport={handleExport}
                                />
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No hay campañas activas
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={activeModal === MODAL_TYPES.CREATE} 
                onClose={closeModal}
                title="Volver"
            >
                <CardCreateCampain setData={updateCampaign} />
            </Modal>

            <Modal 
                isOpen={activeModal === MODAL_TYPES.EDIT} 
                onClose={closeModal}
                title="Volver"
            >
                {selectedCampaign && (
                    <CardEditCampain data_campain={selectedCampaign} />
                )}
            </Modal>

            <Modal 
                isOpen={activeModal === MODAL_TYPES.TRANSFER} 
                onClose={closeModal}
                title="Volver"
            >
                {selectedCampaign && (
                    <CardAssignCampain
                        data={selectedCampaign}
                        updateCredits={updateCreditsCampaign}
                    />
                )}
            </Modal>
        </div>
    );
}