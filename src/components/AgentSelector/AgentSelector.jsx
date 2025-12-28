import { useState, useMemo } from "react";

export default function AgentSelector({
    agents_details = [],
    onChange,
    title = "Seleccionar agente",
    multiSelect = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const handleToggle = (agent) => {
        let newSelectedIds;

        // Si el id es null, limpiar toda la selección
        if (agent.id === null) {
            newSelectedIds = [];
        } else if (multiSelect) {
            // Modo múltiple: agregar o quitar del array
            if (selectedIds.includes(agent.id)) {
                newSelectedIds = selectedIds.filter(id => id !== agent.id);
            } else {
                newSelectedIds = [...selectedIds, agent.id];
            }
        } else {
            // Modo único: reemplazar selección
            newSelectedIds = [agent.id];
            setIsOpen(false);
        }

        setSelectedIds(newSelectedIds);

        // Devolver los agentes seleccionados completos
        const selectedAgents = agents_details.filter(a => newSelectedIds.includes(a.id));
        onChange(selectedAgents);
    };

    const displayText = useMemo(() => {
        if (selectedIds.length === 0) {
            return '-- Seleccionar --';
        }

        const selectedAgents = agents_details.filter(a => selectedIds.includes(a.id));

        return selectedAgents.map(agent => {
            const nameParts = agent.name ? agent.name.split(" ") : ['', ''];
            return `${nameParts[0]?.substring(0,1) || ''}.${nameParts[1] || ''}`;
        }).join(', ');
    }, [selectedIds, agents_details]);

    return (
        <label>
            <strong>{title}</strong>
            <div className="CardAssignCampain__agentsSelect">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="CardAssignCampain__agentsResult"
                >
                    <label>{displayText}</label>
                </div>
                {isOpen && (
                    <div className="CardAssignCampain__agentsOptions">
                        {selectedIds.length > 0 && (
                            <div
                                className="CardAssign--clear"
                                onClick={() => handleToggle({ id: null, name: '-- Seleccionar --' })}
                            >
                                <label>Quitar todos</label>
                            </div>
                        )}
                        {agents_details.map((agent) => {
                            const nameParts = agent.name ? agent.name.split(" ") : ['', ''];
                            const isSelected = selectedIds.includes(agent.id);

                            return (
                                <div
                                    key={agent.id}
                                    className={isSelected ? "CardAssign--agentchoose" : ""}
                                    onClick={() => handleToggle(agent)}
                                >
                                    <label>
                                        {nameParts[0]?.substring(0,1) || ''}.{" "}
                                        {nameParts[1] || ''}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </label>
    );
}