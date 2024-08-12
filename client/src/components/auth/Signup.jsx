import React, { useRef, useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate=useNavigate()
  const [showpass, setshowpass] = useState(false)
  const [isloading, setisloading] = useState(false)
  const [iserr, setiserr] = useState(false)
  const passref=useRef()
  const userref=useRef()
  const emailref=useRef()
  axios.defaults.withCredentials=true
   // Function to toggle password visibility
  const togglePass = () => {
    passref.current.type = showpass ? 'password' : 'text';
    setshowpass(!showpass);
  };
  //  function to signup
  const handleSubmit=(e)=>{
    e.preventDefault()
    setisloading(true)
    axios.post('https://charlog-server.vercel.app/signup',{
      username:userref.current.value,
      email: emailref.current.value,
      password: passref.current.value
    }).then((data)=>{
      console.log(data);
      toast.success('signed up successfully you can login now')
      setisloading(false)
      setiserr(false)
      userref.current.value=''
      emailref.current.value=''
      passref.current.value=''
      navigate('/login')
    }).catch((err)=>{
      console.log(err);
      toast.error('internal server error')
      setisloading(false)
      setiserr(true)
    })
  }
  return (
    <div className='bg-gray-300 h-screen flex justify-center items-center'>
       <div className='flex flex-col gap-6 bg-white w-[300px] px-4 py-6 rounded-lg items-center shadow'>
        {iserr && <p className='text-red-600 text-center'>Something went wrong</p>}
         <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
         <input type="text" placeholder='Username' className='border-2 border-gray-400 rounded-lg px-2 py-1 text-lg outline-blue-600' ref={userref}/>
         <input type="email" placeholder='Email' className='border-2 border-gray-400 rounded-lg px-2 py-1 text-lg outline-blue-600' ref={emailref}/>

         <div className='relative cursor-pointer'>
         <input type="password" placeholder='Password' className='border-2 border-gray-400 rounded-lg px-2 py-1 text-lg outline-blue-600' ref={passref}/>
          <div className='absolute top-[50%] right-2 transform translate-y-[-50%]' onClick={togglePass}>
          {!showpass?<FaEyeSlash size='1.3rem'/>:<FaRegEye size='1.3rem'/>}
          </div>
         </div>

         <button type="submit" className='bg-green-600 text-white text-lg font-semibold rounded-lg py-2'>{isloading?'signing...':'Signup'}</button>
         </form>
         <Link to='/login'>
         <button type="button" className='bg-blue-600 text-white text-lg font-semibold rounded-lg py-2 px-4 w-fit'>Login other account</button>
         </Link>
       </div>
    </div>
  )
}

export default Signup