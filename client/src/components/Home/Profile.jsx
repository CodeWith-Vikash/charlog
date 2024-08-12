import React, { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { MainContext } from "../../context/MainContext";
import { useParams,Link } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import User from './User'

const Profile = () => {
  const { handleFileChange, allposts, getPost, userdata, getlocalstorage,findprofileuser,profileuser } =
  useContext(MainContext);
  const [userposts, setuserposts] = useState([]);
  const [following, setfollowing] = useState(false);
  const [followerror, setfollowerror] = useState(false);
  const [alredayFollowing, setalredayFollowing] = useState(false);
  const [unfollowing, setunfollowing] = useState(false);
  const [showFollowers, setshowFollowers] = useState(false);
  const [showFollowing, setshowFollowing] = useState(false);
  const [inputval, setinputval] = useState("");
  console.log('profileuser:',profileuser)
  axios.defaults.withCredentials=true


  const { id } = useParams();
  
   // function to toggle Followers
   const toggleFollwers = () => {
    setshowFollowers(!showFollowers);
    setinputval('')
  };
  // function to toggle Following
  const toggleFollwing = () => {
    setshowFollowing(!showFollowing);
    setinputval('')
  };

  // Function to get user posts
  const findUserPosts = () => {
    if (allposts) {
      const data = allposts.filter((post) => post.userInfo.userId === id);
      setuserposts(data);
      console.log(data);
    }
  };
  

  // function to follow user
  const follow = () => {
    setfollowing(true);
    axios
      .patch(`https://charlog-server.vercel.app/follow/${userdata._id}`, {
        username: profileuser?.username,
        userId: profileuser?._id,
        avatar: profileuser?.avatar,
        following: profileuser?.following,
        followers: profileuser?.followers
      })
      .then((result) => {
        console.log(result);
        setfollowing(false);
        setfollowerror(false);
        findprofileuser(id);
        getlocalstorage()
      })
      .catch((err) => {
        console.log(err);
        toast.error("server error");
        setfollowerror(true);
        setfollowing(false);
      });
  };

  // function to unfollow user
  const unfollow = () => {
    setunfollowing(true);
    axios
      .patch(`https://charlog-server.vercel.app/unfollow/${userdata._id}`, {
        userId: profileuser._id,
      })
      .then((result) => {
        console.log(result);
        setunfollowing(false);
        setfollowerror(false);
        findprofileuser(id);
        getlocalstorage()
      })
      .catch((err) => {
        console.log(err);
        toast.error("server error");
        setfollowerror(true);
        setunfollowing(false);
      });
  };

  useEffect(() => {
    let isfollowing = profileuser?.followers?.some(
      (user) => user.userId == userdata?._id
    );
    console.log('profilefollowing :',isfollowing)
    setalredayFollowing(isfollowing);
  }, [profileuser,id]);

  useEffect(() => {
    getPost();
    findprofileuser(id);
    setshowFollowers(false)
    setshowFollowing(false)
  }, [id]);

  useEffect(() => {
    findUserPosts();
  }, [allposts]);
  return (
    <>
      <div className={`min-h-screen bg-slate-200 relative ${
        showFollowers || showFollowing
          ? "h-screen overflow-hidden"
          : null
      }`}>
        <section className="bg-pink-100 flex justify-center">
          <div className="flex flex-col items-center gap-2  md:flex-row p-4 md:gap-4 w-fit">
            <img
              src={profileuser?.avatar}
              className="h-[200px] w-[200px] rounded-full object-cover border-2 border-black"
            />
            {followerror && (
              <p className="text-red-600 text-lg">somethign went wrong</p>
            )}
            <div className="flex flex-col items-center gap-1 w-[300px] leading-4 md:items-start">
              <h3 className="font-bold text-2xl">{profileuser?.username}</h3>
              <div className="flex gap-4 py-4">
              <p onClick={toggleFollwers}>
                <b>{userposts?.length}</b> Posts
              </p>
              <p className="cursor-pointer" onClick={toggleFollwers}>
                <b>{profileuser?.followers.length}</b> Followers
              </p>
              <p className="cursor-pointer" onClick={toggleFollwing}>
                <b>{profileuser?.following.length}</b> Following
              </p>
            </div>
              {alredayFollowing ? (
                <button
                  className="font-semibold bg-red-600 text-white px-4 py-2 rounded"
                  onClick={unfollow}
                >
                  {unfollowing ? "Removing..." : "Unfollow"}
                </button>
              ) : (
                <button
                  className="font-semibold bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={follow}
                >
                  {following ? "saving..." : "Follow"}
                </button>
              )}
            </div>
          </div>
        </section>
        <hr />
        <section className="flex flex-col gap-6 items-center py-10">
          {userposts.map((post) => {
            return <Post data={post} key={post._id} />;
          })}
        </section>
        {/* followers section */}
      {showFollowers && (
        <section className="edit h-screen w-full absolute top-0 pt-10 flex justify-center">
          <div className="bg-gray-800 text-white w-[300px] md:w-[400px] rounded-lg h-fit ">
            <div className="flex items-center p-2 font-semibold text-lg justify-end gap-[88px] border-b-2">
              <p>Followers</p>
              <span className="cursor-pointer pr-2" onClick={toggleFollwers}>
                ✕
              </span>
            </div>

            <div className="relative flex justify-center p-2 ">
              <input
                type="text"
                placeholder="search"
                value={inputval}
                onChange={(e) => setinputval(e.target.value)}
                className="outline-none rounded-full py-1 px-10 w-full text-black"
              />
              <FaSearch className="absolute top-[50%] left-4 translate-y-[-50%] text-black" />
            </div>

            <div className="flex flex-col p-2 h-[300px] overflow-auto">
              {profileuser?.followers
                .filter((user) =>
                  user.username.toUpperCase().startsWith(inputval.toUpperCase())
                )
                .map((user) => {
                  return (
                    <User user={user} findprofileuser={findprofileuser} id={id}/>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* following section */}
      {showFollowing && (
        <section className="edit h-screen w-full absolute top-0 pt-10 flex justify-center">
          <div className="bg-gray-800 text-white w-[300px] md:w-[400px] rounded-lg h-fit ">
            <div className="flex items-center p-2 font-semibold text-lg justify-end gap-[88px] border-b-2">
              <p>Following</p>
              <span className="cursor-pointer pr-2" onClick={toggleFollwing}>
                ✕
              </span>
            </div>

            <div className="relative flex justify-center p-2 ">
              <input
                type="text"
                placeholder="search"
                value={inputval}
                onChange={(e) => setinputval(e.target.value)}
                className="outline-none rounded-full py-1 px-10 w-full text-black"
              />
              <FaSearch className="absolute top-[50%] left-4 translate-y-[-50%] text-black" />
            </div>

            <div className="flex flex-col p-2 h-[300px] overflow-auto">
              {profileuser?.following.filter((user) =>
                  user.username.toUpperCase().startsWith(inputval.toUpperCase())
                ).map((user) => {
                return (
                  <User user={user} findprofileuser={findprofileuser} id={id}/>
                );
              })}
            </div>
          </div>
        </section>
      )}
      </div>
    </>
  );
};

export default Profile;
