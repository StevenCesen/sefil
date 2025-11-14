import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {HashRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { NotifierContextProvider } from './contexts/notifierContext.jsx'
import { SessionContextProvider } from './contexts/SessionContext.jsx'
import Credit from './pages/Credit/Credit.jsx'
import Credits from './pages/Credits/Credits.jsx'
import Payments from './pages/Payments/Payments.jsx'

(function () {
  const TAB_LIST_KEY = 'system-tab-ids';
  const INSTANCE_ID = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 6);
  const HEARTBEAT_INTERVAL = 5000;
  const TIMEOUT = 10000;

  function getTabList() {
    const raw = localStorage.getItem(TAB_LIST_KEY);
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function setTabList(list) {
    localStorage.setItem(TAB_LIST_KEY, JSON.stringify(list));
  }

  // Limpia pestañas "muertas"
  function cleanDeadTabs(tabList) {
    const now = Date.now();
    const aliveTabs = {};
    for (const [id, timestamp] of Object.entries(tabList)) {
      if (now - timestamp < TIMEOUT) {
        aliveTabs[id] = timestamp;
      }
    }
    return aliveTabs;
  }

  let tabList = getTabList();
  tabList = cleanDeadTabs(tabList);

  if (Object.keys(tabList).length >= 2) {
    alert('Ya hay 2 pestañas activas. Esta se cerrará.');
    window.close();
    return;
  } else {
    tabList[INSTANCE_ID] = Date.now();
    setTabList(tabList);
  }

  // Heartbeat: actualiza el timestamp periódicamente
  const heartbeat = setInterval(() => {
    const list = getTabList();
    list[INSTANCE_ID] = Date.now();
    setTabList(list);
  }, HEARTBEAT_INTERVAL);

  // Eliminar del registro al cerrar la pestaña
  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeat);
    const list = getTabList();
    delete list[INSTANCE_ID];
    setTabList(list);
  });

  // Escucha cambios desde otras pestañas
  window.addEventListener('storage', (event) => {
    if (event.key === TAB_LIST_KEY) {
      let list = getTabList();
      list = cleanDeadTabs(list);
      if (!list.hasOwnProperty(INSTANCE_ID) && Object.keys(list).length >= 2) {
        alert('Se superó el límite de 2 pestañas. Esta se cerrará.');
        window.close();
      }
    }
  });
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <SessionContextProvider>
      <NotifierContextProvider>
        <HashRouter>
          <Routes>

            <Route exact path='/' element={<App/>}>
              <Route index element={<Dashboard/>}></Route>
              <Route path='login' element={<Login/>}></Route>
              <Route path='dashboard/' element={<Dashboard/>}></Route>
              <Route path='dashboard/:action' element={<Dashboard/>}></Route>
              <Route path='dashboard/:action/:ci' element={<Dashboard/>}></Route>
              <Route path='dashboard/:action/view/:id' element={<Dashboard/>}></Route>
              <Route path='dashboard/:action/:id' element={<Dashboard/>}></Route>
              <Route path='dashboard/:action/:id' element={<Dashboard/>}></Route>
              <Route path='dashboard/:action/:type' element={<Dashboard/>}></Route>
              <Route path='dashboard/:action/:type' element={<Dashboard/>}></Route>
              <Route path='credits' element={<Credits/>}></Route>
              <Route path='credits/:id' element={<Credit/>}></Route>
              <Route path='credits/payments/:id' element={<Payments/>}></Route>
            </Route>
            
          </Routes>
        </HashRouter>
      </NotifierContextProvider>
  </SessionContextProvider>
)
