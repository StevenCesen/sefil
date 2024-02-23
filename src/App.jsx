import { Outlet } from 'react-router-dom'
import useSessions from './hooks/useSessions'
import Login from './pages/Login'
import Header from './components/Header/Header'
import NavSlide from './components/navSlide/NavSlide'
import { useEffect, useState } from 'react'
import useNotification from './hooks/useNotification'

function App() {
  useEffect(()=>{
    if(localStorage.getItem('token')!==''){
      if(localStorage.getItem('rol')==='administrador'){
        useNotification()
      }
    }
  },[]);

  return (
      <>
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
