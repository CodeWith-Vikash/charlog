import React, { useContext, useState } from 'react'
import { FaFileImage } from "react-icons/fa6";
import axios from 'axios'
import { MainContext } from '../../context/MainContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const AddPost = () => {
  const [imagesrc, setimagesrc] = useState(null)
  const [textval, settextval] = useState('')
  const [saving, setsaving] = useState(false)
  const [posterror, setposterror] = useState(false)
  const [mediaType,setMediaType] = useState('')
  const {uploadFile,imgloading,getPost,userdata,baseurl}=useContext(MainContext)
  const navigate=useNavigate()
  axios.defaults.withCredentials=true
  

   // function to handle media input
   async function handleFileInput(file) {
    if (file) {
      const fileType = file.type;

      let type;
      if (fileType.startsWith("image/")) {
        type = "image";
      } else if (fileType.startsWith("video/")) {
        type = "video";
      } else if (fileType.startsWith("application/")) {
        type = "file";
      } else {
        type = "unknown";
      }
      if(type=='image' || type=='video'){
        setMediaType(type);
      await uploadFile(file, setimagesrc,setMediaType);
      setfilename(file.name)
      console.log(file.name);
      }else{
        toast.warning('please select image or video')
      }
      
    }
  }

  // function to add post
  const handleSubmit=(e)=>{
    e.preventDefault()
    if(userdata){
      setsaving(true)
    axios.post(`${baseurl}/api/posts`,{
       userInfo:{
         avatar:userdata.avatar,
         username:userdata.username,
         userId:userdata._id
       },
       title:textval,
       media: {
        url:imagesrc,
        mediaType
       },
       likes:[],
       comments:[]
    }).then((data)=>{
      console.log(data);
      toast.info('Post added successfully')
      getPost()
      setposterror(false)
      settextval('')
      setimagesrc(null)
      setsaving(false)
    }).catch((err)=>{
      console.log((err));
      toast.error('internal server error while adding the post')
      setsaving(false)
      setposterror(true)
    })
    }else{
      navigate('/login')
    }
  }
  return (
    <>
      <form className='w-[300px] bg-white p-4 flex flex-col gap-2 rounded shadow' onSubmit={handleSubmit}>
      {posterror && <p className='text-red-500 text-center'>Something went wrong</p>}
      <textarea cols="30" rows="3" placeholder='whats on your mind?'
       className='border-2 border-gray-400 rounded p-2 outline-blue-600 w-full'
       value={textval}
       onChange={(e)=> settextval(e.target.value)}
       required
      ></textarea>
      <input type="file" id='img' className='hidden' 
        onChange={(e)=> handleFileInput(e.target.files[0])}
      />
      <label htmlFor="img"  className='flex flex-col gap-2'>
        {imagesrc && <div>
        {mediaType=='video'?
         <video controls className='w-full h-[150px] object-cover rounded cursor-pointer'>
         <source src={imagesrc} type="video/mp4" />
       </video>
        : <img src={imagesrc} className='w-full h-[150px] object-cover rounded cursor-pointer'/>}
        </div>}
        <div className='flex justify-between'>
        {imgloading?
         <img src="/Fading wheel.gif" className='rounded-full h-10'/>
        :<div className='flex items-center cursor-pointer gap-2'>
        <FaFileImage size='1.5rem' color='violet'/>
        <b>Add media</b>
        </div>}
        <button type='submit' className='bg-green-600 text-white font-semibold px-2 py-1 rounded'>{saving?'posting...':'post'}</button>
        </div>
      </label>
    </form>
    </>
  )
}

export default AddPost