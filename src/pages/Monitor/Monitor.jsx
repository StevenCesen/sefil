import "./Monitor.css";
import { useEffect, useRef, useState } from "react";
import CardUserState from "../../components/CardUserState/CardUserState.jsx";
import { useStoreMonitor } from "../../stores/useStoreMonitor.js";
import { useStoreLoader } from "../../stores/useStoreLoader.js";
import useFetch from "../../hooks/useFetch";
import BackButton from "../../components/BackButton/BackButton";

export default function Monitor(){
    const { agents, setAgents, setIDCampain, updateAgent } = useStoreMonitor();
    const connection = useRef();
    const loader = useStoreLoader();
    const { fetchWithAuth } = useFetch();
    const [campains, setCampains] = useState([]);
    const [selectedCampain, setSelectedCampain] = useState("");

    useEffect(() => {
        fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/campains?state=ACTIVE`)
            .then((response) => response.json())
            .then((data) => {
                if (data.result && data.result.data) {
                    setCampains(data.result.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching campains:', error);
            });
    }, []);

    useEffect(() => {
        let pingInterval;
        let destroyed = false;

        function connect() {
            if (destroyed) return;

            const token = localStorage.getItem('token_monitor') || '';
            const ws = new WebSocket(
                `wss://services.sefil.com.ec/ws/monitor?role=subscriber&token=${token}`
            );
            connection.current = ws;

            ws.onopen = () => {
                pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }));
                    }
                }, 30_000);
            };

            ws.onmessage = (e) => {
                const msg = JSON.parse(e.data);
                if (msg.type === 'init') {
                    localStorage.setItem('token_monitor', msg.token);
                } else if (msg.type === 'metric') {
                    updateAgent({ data: msg.data });
                }
            };

            ws.onclose = () => {
                clearInterval(pingInterval);
                if (!destroyed) setTimeout(connect, 3000);
            };

            ws.onerror = (e) => console.error('WS monitor error:', e);
        }

        connect();

        return () => {
            destroyed = true;
            clearInterval(pingInterval);
            connection.current?.close();
        };
    }, []);

    return (
        <div className="Monitor">
            <BackButton />

            <div className="Monitor__search">
                <h4 className="Monitor__title">Monitoreo</h4>
                <label>
                    Campaña
                    <select
                        value={selectedCampain}
                        onChange={async (e) => {
                            loader.viewOn(true);
                            setSelectedCampain(e.target.value);
                            setIDCampain(e.target.value);
                            await setAgents();
                            loader.viewOn(false);
                        }}
                    >
                        <option value="">-- Todas --</option>
                        {campains.map((campain) => (
                            <option key={campain.id} value={campain.id}>
                                {campain.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="Monitor__content">
                <div className="Monitor__contentHead">
                    <label>Usuario</label>
                    <label>Estado</label>
                    <label>Tiempo</label>
                    <label>Nro. créditos asignados</label>
                    <label>Nro. créditos gestionados<br/>MES.</label>
                    <label>Nro. créditos gestionados<br/>HOY.</label>
                    <label>Nro. créditos gestion efec.<br/>MES.</label>
                    <label>Nro. créditos gestion efec.<br/>HOY.</label>
                    <label>Nro. créditos pendientes</label>
                    <label>Nro. créditos en proceso</label>
                    <label>Nro. créditos no contactables</label>
                    <label>Nro. llamadas<br/>MES.</label>
                    <label>Nro. llamadas<br/>HOY.</label>
                </div>
                {
                    Array.isArray(agents) && agents.map((agent, index) => (
                        <CardUserState
                            key={index}
                            name={agent.name}
                            state={agent.user_state}
                            time={agent.time_state}
                            name_campain={agent.campain_name}
                            mode={"complete"}
                            data={{
                                nro_credits: agent.data?.nro_credits || 0,
                                nro_gestions: agent.data?.nro_gestions || 0,
                                nro_gestions_dia: agent.data?.nro_gestions_dia || 0,
                                nro_gestions_efec: agent.data?.nro_gestions_efec || 0,
                                nro_gestions_efec_dia: agent.data?.nro_gestions_efec_dia || 0,
                                nro_pendientes: agent.data?.nro_pendientes || 0,
                                nro_proceso: agent.data?.nro_proceso || 0,
                                nro_no_contactables: agent.data?.nro_no_contactables || 0,
                                nro_proceso_dia: agent.data?.nro_proceso_dia || 0,
                                nro_calls: agent.data?.nro_calls || 0,
                                nro_calls_acum: agent.data?.nro_calls_acum || 0,
                            }}
                        />
                    ))
                }
            </div>
        </div>
    );
}