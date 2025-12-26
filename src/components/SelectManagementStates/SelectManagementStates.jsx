import useTemplates from '../../hooks/useTemplates';

export default function SelectManagementStates({ value, onChange }) {
    const { templates, loading, error } = useTemplates();

    return (
        <label>
            Estado gestión
            <select
                value={value}
                onChange={(e) => onChange('estado_gestion', e.target.value)}
                disabled={loading}
            >
                <option value="">
                    {loading ? '-- Cargando... --' : '-- Seleccionar --'}
                </option>
                {error && <option value="" disabled>{error}</option>}
                {!loading && !error && templates.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                ))}
            </select>
        </label>
    );
}