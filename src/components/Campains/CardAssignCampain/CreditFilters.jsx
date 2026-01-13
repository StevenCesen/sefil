import { useState, useEffect } from "react";
import FilterRangeContainer from "../../FilterRangeContainer/FilterRangeContainer";
import SelectCollectionState from "../../SelectCollectionState/SelectCollectionState";
import SelectManagementStates from "../../SelectManagementStates/SelectManagementStates";
import SelectAgencies, { ALL_AGENCIES } from "../../SelectAgencies/SelectAgencies";

export default function CreditFilters({ onFiltersChange, typeAssign }) {
    const [filters, setFilters] = useState({
        mora: { min: 0, max: 0 },
        cuota: { min: 0, max: 0 },
        monto: { min: 0, max: 0 },
        estado: '',
        estado_gestion: '',
        agencies: [],
        management_tray: ''
    });

    const handleRangeUpdate = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }

    const handleAgencyFilter = (agency, isChecked) => {
        setFilters(prev => {
            let newAgencies = [...prev.agencies];

            if (agency === "-- Todas --") {
                newAgencies = isChecked ? [...ALL_AGENCIES] : [];
            } else {
                if (isChecked) {
                    newAgencies.push(agency);
                } else {
                    newAgencies = newAgencies.filter(a => a !== agency);
                }
            }

            return {
                ...prev,
                agencies: newAgencies
            };
        });
    }

    useEffect(() => {
        onFiltersChange(filters);
    }, [filters, onFiltersChange]);

    return (
        <>
            <span style={{ marginTop: "10px" }}>
                <strong>Filtrado de datos</strong>
            </span>

            <div className="CardAssignCampain__filters">
                <FilterRangeContainer onFilterChange={handleRangeUpdate} />

                <div className="CardAssignCampain__selects">
                    <SelectCollectionState
                        value={filters.estado}
                        onChange={handleRangeUpdate}
                        typeAssign={typeAssign}
                    />

                    <SelectManagementStates
                        value={filters.estado_gestion}
                        onChange={handleRangeUpdate}
                    />

                    <SelectAgencies
                        selectedAgencies={filters.agencies}
                        onAgencyChange={handleAgencyFilter}
                    />

                    <label>
                        Bandeja
                        <select
                            value={filters.management_tray}
                            onChange={(e) => handleRangeUpdate('management_tray', e.target.value)}
                        >
                            <option value="">-- Todas --</option>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="GESTIONADO">GESTIONADO</option>
                            <option value="EN PROCESO">EN PROCESO</option>
                        </select>
                    </label>
                </div>
            </div>
        </>
    );
}
