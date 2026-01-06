import { useEffect, useState, useCallback } from "react";
import CardSync from "../../components/CardSync/CardSync";
import CardEditCampain from "../../components/Campains/CardEdirCampain/CardEditCampain";
import CardAssignCampain from "../../components/Campains/CardAssignCampain/CardAssignCampain";
import CardCreateCampain from "../../components/Campains/CardCreateCampain/CardCreateCampain";
import BackButton from "../../components/BackButton/BackButton";
import useFetch from "../../hooks/useFetch";
import "./Campains.css";
import exportCampaign from "../../helpers/Campaigns/exportCampaign";

const MODAL_TYPES = {
    CREATE: 'create',
    EDIT: 'edit',
    TRANSFER: 'transfer'
};

const CampaignItem = ({ campaign, onEdit, onTransfer, onExport }) => (
    <div className="Campains__item">
        <label>{campaign.name}</label>
        <label>{campaign.state}</label>
        <label>{campaign.begin_time}</label>
        <label>{campaign.end_time}</label>
        {campaign.state !== 'FINISHED' && (
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

export default function Campains() {
    const { fetchWithAuth } = useFetch();
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
        setCampaigns(prev => [...prev, newCampaign]);
        closeModal();
    }, [closeModal]);

    const handleEdit = useCallback((campaign) => {
        openModal(MODAL_TYPES.EDIT, campaign);
    }, [openModal]);

    const handleTransfer = useCallback((campaign) => {
        openModal(MODAL_TYPES.TRANSFER, campaign);
    }, [openModal]);

    const handleExport = useCallback(async (campaign) => {
        const blob = await exportCampaign({ campain_id: campaign.id });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;

        const campain_name = campaign.name || 'Campaña';
        const today = new Date();
        const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
        const month = monthNames[today.getMonth()];

        link.download = `Campaña-${month}-${campain_name}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    }, []);

    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/campains`);
            const data = await response.json();

            if (data.result && data.result.data && Array.isArray(data.result.data)) {
                setCampaigns(data.result.data);
            } else {
                setCampaigns([]);
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    if (loading && !campaigns) {
        return <div>Cargando...</div>;
    }

    const activeCampaigns = campaigns.filter(campaign => campaign.state === "ACTIVE") || [];

    return (
        <div className="Campains">
            <BackButton />

            <div className="Campains__content">
                <h3 className="Campains__title">Creación y asignación de campaña</h3>

                <div className="Campains__sincronice">
                    <div>
                        <CardSync/>
                    </div>
                </div>

                <div className="Campains__list">
                    <div className="Campains__access">
                        <h4 className="Campains__subtitle">Campañas</h4>
                        <button onClick={() => openModal(MODAL_TYPES.CREATE)}>
                            Nueva campaña
                        </button>
                    </div>

                    <div className="Campains__header">
                        <label>Nombre</label>
                        <label>Estado</label>
                        <label>Fecha de inicio</label>
                        <label>Fecha de fin</label>
                        <label>Acciones</label>
                    </div>

                    <div className="Campains__items">
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
                        campain_id={selectedCampaign.id}
                    />
                )}
            </Modal>
        </div>
    );
}
