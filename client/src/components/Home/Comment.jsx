import React, { useContext,useState } from 'react'
import {Link} from 'react-router-dom'
import {MainContext} from '../../context/MainContext'
import { RiSendPlane2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import Reply from './Reply'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Comment = ({comment,postId}) => {
    const {commentTimeGap,userdata,getPost} =useContext(MainContext)
    const [showreplies, setshowreplies] = useState(false)
    const [showinputbox, setshowinputbox] = useState(false)
    const [replyval, setreplyval] = useState('')
    const [replying, setreplying] = useState(false)
    const [deleting, setdeleting] = useState(false)
    const [editing, setediting] = useState(false)
    const [saving, setsaving] = useState(false)
    const [editval, seteditval] = useState('')
    axios.defaults.withCredentials=true


    const toggleReplyBox=()=>{
      setshowinputbox(!showinputbox)
    }

   //  function to reply comment
    const replyComment=(e)=>{
       e.preventDefault()
       setreplying(true)
       axios.patch(`/api/post/${postId}/comment/${comment._id}/reply`,{
           username:userdata.username,
           avatar: userdata.avatar,
           reply: replyval,
           userId: userdata._id,
           commentUser:comment.username
       }).then((result)=>{
          console.log(result);
          setreplyval('')
          setreplying(false)
          getPost()
          setshowreplies(true)
         }).catch((err)=>{
            console.log(err)
            toast.error('internal server error')
            setreplying(false)
       })
    }
    // function to delete a comment
    const deleteComment=()=>{
      setdeleting(true)
      axios.patch(`/api/post/${postId}/comment/${comment._id}/delete`).then((result)=>{
        console.log(result);
        toast.info('comment deleted')
        setdeleting(false)
        getPost()
      }).catch((err)=>{
        console.log(err);
        toast.error('internal server error')
        setdeleting(false)
      })
    }
    // function to edit a comment
    const editComment=()=>{
      setediting(true)
      seteditval(comment.comment)
    }

    // function to save edited comment
    const saveComment=(e)=>{
      e.preventDefault()
      setsaving(true)
      axios.patch(`/api/post/${postId}/comment/${comment._id}/edit`,{
        comment:editval
      }).then((result)=>{
        console.log(result);
        setsaving(false)
        setediting(false)
        getPost()
      }).catch((err)=>{
        console.log(err);
        toast.error('internal server error')
        setsaving(false)
      })
    }
  return (
    <>
       <div className='flex gap-2'>
              {deleting?
              <img src="/Fading wheel.gif" className='h-10 w-10 object-cover rounded-full'/>
              :<Link to={comment.userId==userdata?._id?`/dash`:`/profile/${comment.userId}`}>
              <img src={comment.avatar} className='h-10 w-10 rounded-full object-cover'/>
              </Link>}
               <div>
               <div className='bg-gray-200 p-2 rounded w-full'>
                <div className='flex items-center justify-between gap-10'>
                <p className='font-semibold'>{comment.username}</p>
                 {!editing && comment.userId==userdata?._id && <div className='flex gap-2'>
                  <MdEditDocument size='1rem' color='green' className='cursor-pointer' onClick={editComment}/>
                  <FaTrashAlt size='1rem' color='red' className='cursor-pointer' onClick={deleteComment}/>
                 </div>}
                </div>
                {editing?
                 <form className='relative' onSubmit={saveComment}>
                  <textarea rows="3" cols='30' className='outline-none border-2 border-black rounded bg-transparent p-2 text-sm w-full'
                  required
                  value={editval}
                  onChange={(e)=> seteditval(e.target.value)}
                  ></textarea>
                  <button type="submit">
                  <div className="rounded-full bg-green-700 w-fit p-2 h-fit absolute bottom-3 right-2" title='save'>
                  {saving?
                   <img src="/Fading wheel.gif" className='h-5 w-5 object-cover rounded-full'/>
                  :<RiSendPlane2Fill size='1.2rem' color="white"/>}
                  </div>
                  </button>
                 </form>
                :<p className='leading-4'>
                {comment.comment}
                </p>}
               </div>
               <div className='flex gap-2 items-center px-2'>
                <p className='text-sm'>{commentTimeGap(comment.commentDate)}</p>
                <p className='text-sm font-semibold hover:underline cursor-pointer' onClick={toggleReplyBox}>reply</p>
                </div>
                
                 {comment.replies.length>0 && <p className='cursor-pointer' onClick={()=>setshowreplies(!showreplies)}>View {comment.replies.length} {comment.replies.length>1?'replies':'reply'}</p>}
                 {/* replies section */}
                 {showreplies && <section className="replies flex flex-col gap-2">
                    {comment.replies.map((reply,index)=>{
                      return <Reply reply={reply} username={comment.username} postId={postId} commentId={comment._id} key={index}/>
                    })}
                 </section>}
               </div>
            </div>
            {/* reply box */}
            {showinputbox && <form className='flex items-center gap-2 bg-gray-800 p-2 rounded' onSubmit={(e)=>replyComment(e)}>
                <Link to='/dash'>
                {replying?
                 <img src="/Fading wheel.gif" className='h-10 w-10 object-cover rounded-full'/>
                :<img src={userdata?.avatar} className='h-7 w-7 rounded-full object-cover'/>}
                </Link>
                <input type="text" value={replyval}
                 required
                 onChange={(e)=> setreplyval(e.target.value)}
                 placeholder={`reply to ${comment.username}`}
                 className='outline-none p-2 rounded-full bg-green-200 text-sm w-[90%]'
                />
                <button type="submit">
                <RiSendPlane2Fill size='1.5rem' color='white' className='cursor-pointer'/>
                </button>
             </form>}
    </>
  )
}

export default Comment