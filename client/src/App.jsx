import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './components/Home/Home'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import Navbar from './components/Home/Navbar'
import Dashboard from './components/Home/Dashboard'
import Profile from './components/Home/Profile'
import Footer from './components/Home/Footer'

const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/profile/:id' element={<Profile/>}/>
         <Route path='/dash' element={<Dashboard/>}/>
         <Route path='/signup' element={<Signup/>}/>
         <Route path='/login' element={<Login/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App