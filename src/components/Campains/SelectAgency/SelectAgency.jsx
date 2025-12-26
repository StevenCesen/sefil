import { useEffect, useState } from "react";
import useAgencies from "../../../hooks/useAgencies";

const SelectAgency = ({setOptions}) => {
    const [seleccionadas, setSeleccionadas] = useState([]);
    const { agencies: agenciasFromAPI, loading } = useAgencies();

    // Build agencies list with "-- Todas --" at the beginning
    const agencias = ["-- Todas --", ...agenciasFromAPI];

    const handleCheckboxChange = (agencia) => {
        if (agencia === "-- Todas --") {
            if (seleccionadas.length === agenciasFromAPI.length) {
                setSeleccionadas([]);
                setOptions([]);
            } else {
                setSeleccionadas(agenciasFromAPI);
                setOptions(agenciasFromAPI);
            }
        } else {
            if (seleccionadas.includes(agencia)) {
                setSeleccionadas(seleccionadas.filter(a => a !== agencia));
                setOptions(seleccionadas.filter(a => a !== agencia));
            } else {
                setSeleccionadas([...seleccionadas, agencia]);
                setOptions([...seleccionadas, agencia])
            }
        }
    };

    const isAllSelected = seleccionadas.length === agenciasFromAPI.length && agenciasFromAPI.length > 0;

    useEffect(() => {
        if (isAllSelected && !seleccionadas.includes("-- Todas --")) {
            setSeleccionadas(prev => [...prev]);
        }
    }, []);

    if (loading) {
        return (
            <div style={{ fontFamily: 'Arial, sans-serif' }}>
                <label>Selecciona agencias: </label>
                <div style={{ padding: '10px' }}>
                    Cargando agencias...
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <label>Selecciona agencias: </label>
        <div style={{ display: 'flex',paddingLeft:'10px', flexDirection: 'column', maxHeight: '600px', overflowY: 'auto' }}>
            {agencias.map((agencia, index) => {
            const isChecked =
                agencia === "-- Todas --"
                ? isAllSelected
                : seleccionadas.includes(agencia);

            return (
                <label key={index} style={{ marginBottom: '4px' }}>
                <input
                    type="checkbox"
                    key={agencia}
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(agencia)}
                />
                {" "}{agencia}
                </label>
            );
            })}
        </div>

        <div style={{ marginTop: '20px' }}>
            <h4>Agencias seleccionadas:</h4>
            {seleccionadas.length > 0 ? (
            <ul>
                {seleccionadas.map((agencia, index) => (
                    <li key={index}>{agencia}</li>
                ))}
            </ul>
            ) : (
            <p>No hay agencias seleccionadas.</p>
            )}
        </div>
        </div>
    );
};

export default SelectAgency;