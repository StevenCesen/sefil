import "./Directions.css";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/loader";
import SelectAgency from "../../components/Campains/SelectAgency/SelectAgency";
import sendpush from "../../helpers/sendpush";
import useBusinesses from "../../hooks/useBusinesses";
import BackButton from "../../components/BackButton/BackButton";

export default function Directions() {
    const { businesses, loading: loadingBusinesses } = useBusinesses();

    const [filter, setFilter] = useState({
        business_id: '',
        business_name: '',
        agencia: '',
        user_id: '',
        name: ''
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSelectAgent = (e) => {
        const value = e.target.value;
        if (value === '') {
            setFilter(prev => ({
                ...prev,
                user_id: '',
                name: ''
            }));
            return;
        }

        const [userId, userName] = value.split('/');
        setFilter(prev => ({
            ...prev,
            user_id: userId,
            name: userName
        }));
    }

    const handleSelectBusiness = (e) => {
        const value = e.target.value;
        if (value === '') {
            setFilter(prev => ({
                ...prev,
                business_id: '',
                business_name: ''
            }));
            return;
        }

        const [businessId, businessName] = value.split('/');
        setFilter(prev => ({
            ...prev,
            business_id: businessId,
            business_name: businessName
        }));
    }

    const handleSelectAgency = (value) => {
        setFilter(prev => ({
            ...prev,
            agencia: value
        }));
    }

    const handleDownload = (type) => {
        if (!filter.user_id) {
            sendpush({
                title: 'Error de validación',
                message: 'Debe seleccionar un agente',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        if (!filter.business_id) {
            sendpush({
                title: 'Error de validación',
                message: 'Debe seleccionar una empresa',
                type: 'Push--warning',
                timeout: 5000
            });
            return;
        }

        const baseUrl = import.meta.env.VITE_URL_BASE;
        let url = '';

        if (type === 'direcciones') {
            if (!filter.agencia) {
                sendpush({
                    title: 'Error de validación',
                    message: 'Debe seleccionar una agencia',
                    type: 'Push--warning',
                    timeout: 5000
                });
                return;
            }
            url = `${baseUrl}/GenDirecciones?user_id=${filter.user_id}&agente=${encodeURIComponent(filter.name)}&cartera=${filter.business_name}&agencias=${encodeURIComponent(JSON.stringify(filter.agencia))}`;
        } else if (type === 'asignacion') {
            url = `${baseUrl}/GenAsignacion?user_id=${filter.user_id}&agente=${encodeURIComponent(filter.name)}&cartera=${filter.business_name}`;
        }

        window.open(url, '_blank');
    }

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/users?agents=true&is_active=1`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }

            const data = await response.json();

            if (data.code === 1 && data.result) {
                setUsers(data.result.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            sendpush({
                title: 'Error',
                message: 'Error al cargar los agentes',
                type: 'Push--error',
                timeout: 5000
            });
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading || loadingBusinesses) return <Loader />;

    return (
        <div className="pageConsulta">
            <BackButton />

            <div className="Directions__search">
                <label>
                    Agente
                    <select
                        value={filter.user_id ? `${filter.user_id}/${filter.name}` : ''}
                        onChange={handleSelectAgent}
                    >
                        <option value="">-- Seleccionar --</option>
                        {users.map(user => (
                            <option key={user.id} value={`${user.id}/${user.name}`}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Empresa
                    <select
                        value={filter.business_id ? `${filter.business_id}/${filter.business_name}` : ''}
                        onChange={handleSelectBusiness}
                    >
                        <option value="">-- Seleccionar --</option>
                        {businesses.map(business => (
                            business.name !== 'CARTERA VENDIDA' && (
                                <option key={business.id} value={`${business.id}/${business.name}`}>
                                    {business.name}
                                </option>
                            )
                        ))}
                    </select>
                </label>

                <SelectAgency setOptions={handleSelectAgency} />

                <button
                    onClick={() => handleDownload('direcciones')}
                    disabled={!filter.user_id || !filter.business_id}
                >
                    Descargar direcciones
                </button>

                <button
                    onClick={() => handleDownload('asignacion')}
                    disabled={!filter.user_id || !filter.business_id}
                >
                    Descargar asignación
                </button>
            </div>
        </div>
    );
}
