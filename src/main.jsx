import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {HashRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { NotifierContextProvider } from './contexts/notifierContext.jsx'
import { SessionContextProvider } from './contexts/SessionContext.jsx'

(function () {
  const TAB_LIST_KEY = 'system-tab-ids';
  const INSTANCE_ID = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 6);

  // Recupera la lista actual de pestañas activas
  function getTabList() {
    const raw = localStorage.getItem(TAB_LIST_KEY);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Guarda una lista actualizada de pestañas activas
  function setTabList(list) {
    localStorage.setItem(TAB_LIST_KEY, JSON.stringify(list));
  }

  // Agrega esta pestaña a la lista si hay cupo
  let tabList = getTabList();

  if (tabList.length >= 2) {
    alert('Ya hay 2 pestañas abiertas del sistema. Esta se cerrará.');
    window.close();
    return;
  } else {
    tabList.push(INSTANCE_ID);
    setTabList(tabList);
  }

  // Al cerrar la pestaña, eliminarla del registro
  window.addEventListener('beforeunload', () => {
    const updatedList = getTabList().filter(id => id !== INSTANCE_ID);
    setTabList(updatedList);
  });

  // También escucha cambios desde otras pestañas (opcional para sincronización)
  window.addEventListener('storage', (event) => {
    if (event.key === TAB_LIST_KEY) {
      const currentList = getTabList();
      if (!currentList.includes(INSTANCE_ID) && currentList.length >= 2) {
        // Nuestra pestaña fue desregistrada o hay demasiadas pestañas
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
            </Route>
            
          </Routes>
        </HashRouter>
      </NotifierContextProvider>
  </SessionContextProvider>
)
