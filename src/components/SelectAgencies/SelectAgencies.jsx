import { useState } from "react";
import useAgencies from "../../hooks/useAgencies";

export const ALL_AGENCIES = [];

export default function SelectAgencies({ selectedAgencies, onAgencyChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const { agencies: agenciesFromAPI, loading } = useAgencies();

    const AGENCIES = ["-- Todas --", ...agenciesFromAPI];

    ALL_AGENCIES.length = 0;
    ALL_AGENCIES.push(...agenciesFromAPI);

    const allAgenciesSelected = agenciesFromAPI.every(agency =>
        selectedAgencies.includes(agency)
    );
    
    if (loading) {
        return (
            <label>
                Agencias
                <div>
                    <button disabled>Cargando...</button>
                </div>
            </label>
        );
    }

    return (
        <label>
            Agencias
            <div>
                <button onClick={() => setIsOpen(!isOpen)}>
                    --Seleccionar
                </button>
                {isOpen && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {AGENCIES.map((agencia, index) => {
                            const isChecked = agencia === "-- Todas --"
                                ? allAgenciesSelected
                                : selectedAgencies.includes(agencia);

                            return (
                                <label key={index}>
                                    <input
                                        value={agencia}
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => onAgencyChange(agencia, e.target.checked)}
                                    />
                                    {agencia.toUpperCase()}
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </label>
    );
}