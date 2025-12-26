import { useMemo } from "react";

export default function AgentSelector({ 
    agents, 
    selectedAgent, 
    selectedAgents, 
    isOpen, 
    onToggle, 
    onAgentSelect, 
    onAgentGroup, 
    refElement, 
    title, 
    isOrigin = true 
}) {
    const parsedAgents = useMemo(() => {
        try {
            return JSON.parse(agents || '[]');
        } catch {
            return [];
        }
    }, [agents]);

    return (
        <label>
            <strong>{title}</strong>
            <div className="CardAssignCampain__agentsSelect">
                <div 
                    onClick={onToggle}
                    className="CardAssignCampain__agentsResult"
                >
                    <label ref={refElement}>{selectedAgent.name}</label>
                </div>
                {isOpen && (
                    <div className="CardAssignCampain__agentsOptions">
                        {parsedAgents.map((agent) => {
                            const nameParts = agent.name ? agent.name.split(" ") : ['', ''];
                            return (
                            <div key={agent.id} className={selectedAgents.includes(agent.id) ? "CardAssign--agentchoose" : ""}>
                                <label>
                                    {nameParts[0]?.substring(0,1) || ''}.{" "}
                                    {nameParts[1] || ''}
                                </label>
                                {isOrigin && (
                                    <button
                                        onClick={() => onAgentSelect(agent)}
                                        title="Ver carga actual"
                                    >
                                        <img src="/icons/view.png" alt="Ver"/>
                                    </button>
                                )}
                                <button title="Agrupar">
                                    <img
                                        src="/icons/grou.png"
                                        onClick={() => onAgentGroup(agent, isOrigin)}
                                        alt="Agrupar"
                                    />
                                </button>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </label>
    );
}