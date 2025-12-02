import FilterRange from "../FilterRange/FilterRange";

export default function FilterRangeContainer({ onFilterChange }) {
    return (
        <div className="CardAssignCampain__ranges">
            <FilterRange
                filter={onFilterChange}
                key_val="mora"
                title="Días de mora"
            />
            <FilterRange
                filter={onFilterChange}
                key_val="cuota"
                title="Cuotas pendientes"
            />
            <FilterRange
                filter={onFilterChange}
                key_val="monto"
                title="Monto total"
            />
        </div>
    );
}