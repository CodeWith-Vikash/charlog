import React, { useContext, useEffect, useState } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {MainContext} from '../../context/MainContext'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  const [query, setQuery] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const {userdata,getlocalstorage,allusers,findprofileuser}=useContext(MainContext)
  const navigate=useNavigate()
  const location=useLocation()
  const logOut=()=>{
    localStorage.removeItem('charloguser')
    getlocalstorage()
    toast.warning('User loged out')
    navigate('/')
  }

  useEffect(()=>{
    setQuery('')
  },[location])
  return (
    <>
      <nav className='flex justify-between items-center px-4 py-2 bg-white md:sticky md:top-0 z-50 h-[60px]'>
      <Link to='/'>
      <img src="/logo.png" className={`h-14 ${isFocus?'md:flex hidden':null}`}/>
      </Link>
      <div className="relative text-gray-900">
            <input
              type="text"
              placeholder="Search.."
              className={`outline-none border-2 transition-all delay-100 border-black px-4 rounded-full w-[30vw] md:w-[250px] h-8 ${
                isFocus && "w-[95vw] md:w-[250px]"
              }`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchProduct()}
              onFocus={() => setIsFocus(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocus(false);
                }, 100);
              }}
            />
            <FaSearch
              size="1rem"
              className="absolute right-2 top-[50%] translate-y-[-50%]"
            
            />
          </div>
      <div className={`flex items-center gap-4 ${isFocus?'md:flex hidden':null}`}>
        {userdata?
          <button className='bg-red-600 text-white font-semibold px-2 py-1 rounded' onClick={logOut}>Logout</button>
        :<Link to='/login'>
          <button className='bg-green-600 text-white font-semibold px-2 py-1 rounded'>Login</button>
        </Link>}
        {userdata && <Link to='/dash'>
           <img src={userdata.avatar} className='h-10 w-10 rounded-full object-cover'/>
        </Link>}
      </div>
    </nav>
    {/* search results */}
    {query && <section className='flex flex-col gap-2 p-4 w-full'>
      {
        allusers.filter((user)=> user.username.toLowerCase().includes(query.toLowerCase())).map((user)=>{
          return  <Link to={user._id==userdata?._id?`/dash`:`/profile/${user._id}`}>
             <div className='flex items-center gap-2'>
             <img src={user.avatar} className='h-12 w-12 rounded-full object-cover'/>
             <p className='font-semibold'>{user.username}</p>
          </div>
          </Link>
        })
      }
    </section>}
    </>
  )
}

export default Navbar