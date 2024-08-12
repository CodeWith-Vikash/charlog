import React, { useContext, useRef, useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios'
import {MainContext} from '../../context/MainContext'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate=useNavigate()
  const [showpass, setshowpass] = useState(false)
  const [isloading, setisloading] = useState(false)
  const [iserr, setiserr] = useState(false)
  const passref=useRef()
  const mailref=useRef()
  const {getlocalstorage} = useContext(MainContext)
  axios.defaults.withCredentials=true
 // Function to toggle password visibility
 const togglePass = () => {
  passref.current.type = showpass ? 'password' : 'text';
  setshowpass(!showpass);
};
  //  function to login
  const handleSubmit=(e)=>{
    e.preventDefault()
    setisloading(true)
    axios.post('/login',{
      email:mailref.current.value,
      password:passref.current.value
    },{ withCredentials: true }).then((result)=>{
      console.log(result);
      toast.success('Login successfull')
      setisloading(false)
      localStorage.setItem('charloguser',JSON.stringify(result.data.data.userId))
      getlocalstorage()
      navigate('/')
    }).catch((err)=>{
      console.log(err);
      toast.error(err.response.data.message)
      setiserr(true)
      setisloading(false)
    })
  }

  return (
    <div className='bg-gray-300 h-screen flex justify-center items-center'>
       <div className='flex flex-col gap-6 bg-white w-[300px] px-4 py-6 rounded-lg items-center shadow'>
        {iserr && <p className='text-red-600 text-center'>something went wrong</p>}
         <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
         <input type="email" placeholder='Email' className='border-2 border-gray-400 rounded-lg px-2 py-1 text-lg outline-blue-600' ref={mailref}/>

         <div className='relative cursor-pointer'>
         <input type="password" placeholder='Password' className='border-2 border-gray-400 rounded-lg px-2 py-1 text-lg outline-blue-600' ref={passref}/>
          <div className='absolute top-[50%] right-2 transform translate-y-[-50%]' onClick={togglePass}>
          {!showpass?<FaEyeSlash size='1.3rem'/>:<FaRegEye size='1.3rem'/>}
          </div>
         </div>

         <button type="submit" className='bg-blue-700 text-white text-lg font-semibold rounded-lg py-2'>{isloading?'logging...':'Login'}</button>
         </form>
         <Link to='/signup'>
         <button type="button" className='bg-green-600 text-white text-lg font-semibold rounded-lg py-2 px-4 w-fit'>Create new account</button>
         </Link>
       </div>
    </div>
  )
}

export default Login
// old code