import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import './CardListBusiness.css';

export default function CardListBusiness({ business, onViewPrelacion, onBusinessUpdated }) {
    const { fetchWithAuth } = useFetch();
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(business.capital_contable_percentage ?? '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        try {
            await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/businesses/${business.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ capital_contable_percentage: value }),
            });
            onBusinessUpdated?.();
        } catch (error) {
            console.error('Error updating business:', error);
        } finally {
            setSaving(false);
            setEditing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setValue(business.capital_contable_percentage ?? '');
            setEditing(false);
        }
    };

    return (
        <div className="CardListBusiness">
            <div className="CardListBusiness__item">
                <p>{business.name}</p>
            </div>
            <div className="CardListBusiness__item">
                <p>{business.created_at?.substr(0, 10)}</p>
            </div>
            <div className="CardListBusiness__item">
                <p>{business.updated_at?.substr(0, 10) || business.last_update}</p>
            </div>
            <div className="CardListBusiness__item">
                <p>{business.state}</p>
            </div>
            <div className="CardListBusiness__item" data-label="Porcentaje capital contable">
                {editing ? (
                    <div className="CardListBusiness__editRow">
                        <input
                            className="CardListBusiness__editInput"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            disabled={saving}
                        />
                        <button
                            className="CardListBusiness__saveBtn"
                            onClick={handleSave}
                            disabled={saving}
                            title="Guardar"
                        >
                            <Check size={13} />
                        </button>
                        <button
                            className="CardListBusiness__cancelBtn"
                            onClick={() => {
                                setValue(business.capital_contable_percentage ?? '');
                                setEditing(false);
                            }}
                            title="Cancelar"
                        >
                            <X size={13} />
                        </button>
                    </div>
                ) : (
                    <p>{value !== '' ? `${value}%` : '-'}</p>
                )}
            </div>
            <div className="CardListBusiness__item">
                <button
                    className="CardListBusiness__prelacionBtn"
                    onClick={onViewPrelacion}
                >
                    Orden de prelación
                </button>
            </div>
            <div className="CardListBusiness__item">
                <button
                    className="CardListBusiness__editBtn"
                    onClick={() => setEditing(true)}
                    title="Editar porcentaje capital contable"
                >
                    <Pencil size={14} />
                </button>
            </div>
        </div>
    );
}
