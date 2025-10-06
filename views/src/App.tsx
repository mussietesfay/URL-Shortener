

import Home from "./pages/home/Home";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import UrlShortener from "./components/urlShortener/UrlShortener";
import UrlList from "./components/urlList/UrlList";
import {Routes , Route, useNavigate, Navigate} from 'react-router-dom'
import {useEffect, useState } from "react";
import axiosInstance from './axiosConfig'
import {AppState} from './context/AppContext'
// import type {User } from './types/userTypes'


const App = () => {
  const [user , setUser] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(()=>{
    const userCheck = async ()=>{
     const token = localStorage.getItem('token');

     if(!token){
      navigate('/');
      return;
     }

    try {
      const response = await axiosInstance.get('/usercheck' , {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      if(response?.data && response?.data?.user){
          setUser(response?.data?.user?.username)
        }else{
        console.error("Invalid userCheck response structure:", response.data);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
        }
     
    } catch (error) {
      console.error("User check failed:", error);
      localStorage.removeItem('token');
      navigate('/login');
    }

    }
    userCheck();
  }, [])

  return (
    <AppState.Provider value={{user , setUser}}>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/shorten" element={user ? <UrlShortener/> :  <Navigate to={'/'}/>}/>
        <Route path="/urls" element={user ? <UrlList/> :  <Navigate to={'/'}/>}/>
      </Routes>
      
    </AppState.Provider>
  )
}

export default App