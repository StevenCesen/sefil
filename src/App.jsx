import { Outlet } from 'react-router-dom'
import useSessions from './hooks/useSessions'
import Login from './pages/Login'
import Header from './components/Header/Header'
import NavSlide from './components/navSlide/NavSlide'
import { useEffect, useState } from 'react'
import { Notifications } from 'react-push-notification';
import "./index.css";

function App() {

  useEffect(()=>{
    
  },[]);

  return (
      <>
      <Notifications className="push" position={'top-right'}/>
      <Header/>
      {
        (!useSessions()) 
        ?
         <Login />
        :
        <div className="Dashboard">
          <NavSlide
            actions={''}
            permission={''}
          />
          <Outlet/>
        </div>
      }
      </>
  )
}

export default App
