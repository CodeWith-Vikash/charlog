import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/MainContext";
import {Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const User = ({user,findprofileuser,id}) => {
    const [following, setfollowing] = useState(false);
    const [alredayFollowing, setalredayFollowing] = useState(false);
    const [unfollowing, setunfollowing] = useState(false);
    const [userdetails, setuserdetails] = useState({})
    const {userdata} =
    useContext(MainContext);
    console.log(alredayFollowing,'user : ',user);
    axios.defaults.withCredentials=true
    
   
    const finduser=()=>{
      axios.get(`/user/${user.userId}`).then((result)=>{
        setuserdetails(result.data)
        console.log(result);
      }).catch((err)=>{
         console.log(err);
      })
   }
      // function to follow a connection of profile user
  const followConnection = () => {
    setfollowing(true);
    axios
      .patch(`/follow/${userdata._id}`, {
        username: user.username,
        userId: user.userId,
        avatar: user.avatar,
        following: user.following,
        followers: user.followers
      })
      .then((result) => {
        console.log(result);
        setfollowing(false);
        finduser()
      })
      .catch((err) => {
        console.log(err);
        toast.error("server error");
        setfollowing(false);
      });
  };

  // function to unfollow a connection of profile user
  const unfollowConnection = () => {
    setunfollowing(true);
    axios
      .patch(`/unfollow/${userdata._id}`, {
        userId:user.userId,
      })
      .then((result) => {
        console.log(result);
        setunfollowing(false);
        finduser()
      })
      .catch((err) => {
        console.log(err);
        toast.error("server error");
        setunfollowing(false);
      });
  };

  useEffect(()=>{
    finduser()
  },[id])

 useEffect(()=>{
    let isfollowing = userdetails?.followers?.some(
        (user) => user.userId == userdata?._id
      );
      console.log('userfollow :',isfollowing)
      setalredayFollowing(isfollowing);
 },[userdetails])
  return (
    <div className="flex justify-between p-2 items-center">
       <Link to={user.userId==userdata?._id?`/dash`:`/profile/${user.userId}`}>
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt="user"
            className="h-10 w-10 rounded-full object-cover font-semibold"
          />
          <p className="leading-4 max-w-[90px] md:max-w-[150px]">
            {user.username}
          </p>
        </div>
      </Link>
       {user.userId != userdata?._id && <div>
       {alredayFollowing ? (
        <button
          className="outline-none border-none bg-red-500 text-black font-semibold px-2 rounded h-fit py-1 text-sm"
          onClick={() => unfollowConnection()}
        >
          {unfollowing ? "Removing..." : "Unfollow"}
        </button>
      ) : (
        <button
          className="outline-none border-none bg-blue-400 text-black font-semibold px-2 rounded h-fit py-1 text-sm"
          onClick={() => followConnection()}
        >
          {following ? "saving..." : "Follow"}
        </button>
      )}
       </div>}
    </div>
  );
};

export default User;
