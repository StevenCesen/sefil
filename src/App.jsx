import { Outlet } from 'react-router-dom'
import useSessions from './hooks/useSessions'
import Login from './pages/Login'
import Header from './components/Header/Header'
import NavSlide from './components/navSlide/NavSlide'
import { useEffect, useState } from 'react'
import "./index.css";
import Me from './pages/Me'
import Push from './components/Push/Push'
import CardSelectStateCall from './components/Management/CardSelectStateCall/CardSelectStateCall'
import CardStructure from './components/CardStructure/CardStructure'
import CardCondonacion from './components/CardCondonacion/CardCondonacion'

function App() {
  
  const [session,setSession]=useState({});

  useEffect(()=>{
    if(localStorage.getItem('temp_uS')!=null){
      fetch(`${import.meta.env.VITE_URL_BASE}/users/${localStorage.getItem('temp_uS')}`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((response) => response.json())  
        .then((data) => {

          if(data.data.state==='FUERA DE LÍNEA'){
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            localStorage.removeItem('temp_uS');
            localStorage.removeItem('permission');
            localStorage.removeItem('name');
            localStorage.removeItem('extension');
            
            setSession({
              state:true
            });

          }else{
            setSession({
              state:false
            });
          }

        });
    }else{
      setSession({
        state:false
      });
    }
    
  },[]);

  if(!session) return <></>

  return (
      <>
      <Header/>
      <Push/>
      <CardSelectStateCall/>
      <CardStructure/>
      <CardCondonacion/>

      {
        (!useSessions() & !session.state) 
        ?
          <Login/>
        :
          (localStorage.getItem('change_ps')==="true")
          ?
            <div className="Dashboard">
              <NavSlide
                actions={''}
                permission={''}
              />
              <Me/>
            </div>
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
