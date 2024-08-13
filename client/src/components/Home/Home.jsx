import React, { useContext, useEffect } from 'react'
import AddPost from './AddPost'
import Post from './Post'
import {MainContext} from '../../context/MainContext'

const Home = () => {
  const {getPost,allposts,postloading}=useContext(MainContext)
  console.log(allposts);
  useEffect(()=>{
    getPost()
  },[])
  return (
    <div className='min-h-screen bg-gray-300 flex flex-col items-center py-8 gap-6'>
      <AddPost/>
      {postloading?
        <img src="/Fading wheel.jif" className='h-20 w-20 pt-5'/>
      :<main className='flex flex-col gap-6'>
        {allposts.map((item,i)=>{
          return <Post data={item} key={i}/>
        })}
      </main>}
    </div>
  )
}

export default Home