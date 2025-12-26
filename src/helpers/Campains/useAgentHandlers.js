import { useCallback } from 'react';

export const useAgentHandlers = (updateState, setCredits, performSearch, fetchWithAuth) => {

    const handleAgentSelect = useCallback(async (agent) => {
        updateState({
            agent: { id: agent.id, name: agent.name },
            view_agents: false
        });

        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/credits?user_id=${agent.id}`);
            const creditsData = await response.json();
            const credits = creditsData?.result?.data || creditsData?.data || creditsData;

            if (credits) {
                setCredits(credits);
                performSearch({ agents: agent.id });
            }
        } catch (error) {
            console.error('Error fetching agent credits:', error);
        }
    }, [updateState, fetchWithAuth, setCredits, performSearch]);

    const updateAgentText = useCallback((refElement, agents, agentName, isOrigin) => {
        let texto = refElement.current.textContent;
        const placeholder = isOrigin ? '-- Seleccionar --' : '-- Seleccionar--';

        if (agents.length === 0) {
            refElement.current.textContent = placeholder;
        } else {
            texto = texto.includes(agentName)
                ? texto.replace(agentName, '').replace(/,+/g, ',').replace(/^,|,$/g, '')
                : `${texto},${agentName}`;

            refElement.current.textContent = texto.replace(`${placeholder},`, '');
        }
    }, []);

    const handleAgentGroup = useCallback((agent, isOrigin, currentState, refElement) => {
        const currentAgents = isOrigin ? currentState.agents_origin : currentState.agents_dtsn;
        const updateKey = isOrigin ? 'agents_origin' : 'agents_dtsn';

        const newAgents = currentAgents.includes(agent.id)
            ? currentAgents.filter(id => Number(id) !== Number(agent.id))
            : [...currentAgents, agent.id];

        updateAgentText(refElement, newAgents, agent.name, isOrigin);

        if (isOrigin) {
            performSearch({ agents: newAgents.length > 0 ? newAgents : agent.id });
        }

        return { [updateKey]: newAgents };
    }, [updateAgentText, performSearch]);

    return {
        handleAgentSelect,
        handleAgentGroup
    };
};