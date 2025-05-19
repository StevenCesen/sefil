import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {HashRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { NotifierContextProvider } from './contexts/notifierContext.jsx'
import { GestionContextProvider } from './contexts/GestionContext.jsx'
import { SessionContextProvider } from './contexts/SessionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <SessionContextProvider>
    <GestionContextProvider>
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
    </GestionContextProvider>
  </SessionContextProvider>
)
