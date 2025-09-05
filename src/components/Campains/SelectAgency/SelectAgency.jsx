import { useEffect, useState } from "react";

const agencias = [
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

const SelectAgency = ({setOptions}) => {
    const [seleccionadas, setSeleccionadas] = useState([]);

    const handleCheckboxChange = (agencia) => {
        if (agencia === "-- Todas --") {
            if (seleccionadas.length === agencias.length - 1) {
                setSeleccionadas([]);
                setOptions([]);
            } else {
                setSeleccionadas(agencias.slice(1));
                setOptions(agencias.slice(1));
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

    const isAllSelected = seleccionadas.length === agencias.length - 1;

    useEffect(() => {
        if (isAllSelected && !seleccionadas.includes("-- Todas --")) {
            setSeleccionadas(prev => [...prev]);
        }
    }, []);

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
