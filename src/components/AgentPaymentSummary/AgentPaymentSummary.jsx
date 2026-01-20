import { useState } from "react";
import "./AgentPaymentSummary.css";
import useFormatterNumber from "../../hooks/useFormatterNumber";

export default function AgentPaymentSummary({ agents }) {
    // Ordenar agentes por total con gestión en campaña descendente
    const sortedAgents = [...agents].sort((a, b) => 
        b.total_with_management_in_campain - a.total_with_management_in_campain
    );

    // Calcular el total de todos los agentes
    const totalSum = sortedAgents.reduce((sum, agent) => 
        sum + (agent.total_with_management_in_campain || 0), 0
    );

    return (
        <div className="AgentPaymentSummary">
            <div className="AgentPaymentSummary__header">
                <div className="AgentPaymentSummary__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <div>
                    <h4>Resumen por Agente</h4>
                    <p>Muestra el resultado del total recuperado por agente con gestión OFERTA DE PAGO en la campaña actual.</p>
                </div>
            </div>
            
            {sortedAgents.length > 0 ? (
                <div className="AgentPaymentSummary__table">
                    <div className="AgentPaymentSummary__table-header">
                        <span>Agente</span>
                        <span>Total con Gestión en Campaña</span>
                    </div>
                    
                    {sortedAgents.map((agent, index) => (
                        <div key={index} className="AgentPaymentSummary__row">
                            <span className="agent-name">{agent.name}</span>
                            <span className="text-success">
                                {useFormatterNumber({ value: agent.total_with_management_in_campain, currency: 'USD' })}
                            </span>
                        </div>
                    ))}
                    
                    <div className="AgentPaymentSummary__row AgentPaymentSummary__row--total">
                        <span className="agent-name">TOTAL</span>
                        <span className="text-success">
                            {useFormatterNumber({ value: totalSum, currency: 'USD' })}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="AgentPaymentSummary__empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <h5>No hay datos de agentes disponibles</h5>
                    <p>Los datos aparecerán cuando haya actividad</p>
                </div>
            )}
        </div>
    );
}
