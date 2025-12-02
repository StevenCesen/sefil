export default function SelectCollectionState({ value, onChange, typeAssign }) {
    return (
        <label>
            Estado crédito
            <select value={value} onChange={(e) => onChange('estado', e.target.value)}>
                <option value="">-- Seleccionar --</option>
                <option value="Vencido">Vencido</option>
                <option value="Vigente">Vigente</option>
                {typeAssign === 'api' && (
                    <>
                        <option value="Vencido en tramite judicial">Vencido en trámite judicial</option>
                        <option value="Castigado">Castigado</option>
                    </>
                )}
                <option value="Judicial">Judicial</option>
            </select>
        </label>
    );
}