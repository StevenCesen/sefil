import { useState } from "react";

const AGENCIES = [
    "-- Todas --",
    "catacocha",
    "palanda", 
    "cariamanga",
    "zamora",
    "zumba",
    "piñas",
    "celica",
    "catamayo",
    "malacatos",
    "santa rosa",
    "oficina las pitas",
    "oficina centro",
    "oficina norte",
    "san miguel de los bancos",
    "milagro",
    "santo domingo",
    "el carmen",
    "cayambe",
    "pasaje",
    "tumbaco",
    "la troncal",
    "amaguaña",
    "naranjal",
    "quinche",
    "quininde"
];

// Export the agencies list without "-- Todas --" for use in other components
export const ALL_AGENCIES = AGENCIES.slice(1);

export default function SelectAgencies({ selectedAgencies, onAgencyChange }) {
    const [isOpen, setIsOpen] = useState(false);

    // "Todas" is checked when all individual agencies are selected
    const allAgenciesSelected = ALL_AGENCIES.every(agency => 
        selectedAgencies.includes(agency)
    );

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