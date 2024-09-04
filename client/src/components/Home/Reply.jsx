import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../../context/MainContext";
import { RiSendPlane2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reply = ({ reply, postId, commentId, username }) => {
  const { commentTimeGap, userdata, getlocalstorage, getPost,baseurl } =
    useContext(MainContext);
  const [showreplybox, setshowreplybox] = useState(false);
  const [replyval, setreplyval] = useState("");
  const [replying, setreplying] = useState(false);
  const [deleting, setdeleting] = useState(false);
  const [editing, setediting] = useState(false);
  const [saving, setsaving] = useState(false);
  const [editval, seteditval] = useState("");
  axios.defaults.withCredentials=true
  // toggle reply box
  const toggleReplyBox = () => {
    setshowreplybox(!showreplybox);
  };

  // function to reply a reply
  const replyAreply = (e) => {
    e.preventDefault();
    setreplying(true);
    axios
      .patch(
        `${baseurl}/api/post/${postId}/comment/${commentId}/reply`,
        {
          username: userdata.username,
          avatar: userdata.avatar,
          reply: replyval,
          userId: userdata._id,
          commentUser: reply.username,
        }
      )
      .then((result) => {
        console.log(result);
        setreplyval("");
        setreplying(false);
        setshowreplybox(false);
        getPost();
      })
      .catch((err) => {
        console.log(err);
        toast.error("server error");
        setreplying(false);
      });
  };

  // function to delete a reply
  const deleteReply = () => {
    setdeleting(true);
    axios
      .patch(
        `${baseurl}/api/post/${postId}/comment/${commentId}/reply/${reply._id}/delete`
      )
      .then((result) => {
        console.log(result);
        toast.info("Reply deleted");
        setdeleting(false);
        getPost();
      })
      .catch((err) => {
        console.log(err);
        toast.error("server error");
        setdeleting(false);
      });
  };
  // function to edit a comment
  const editReply = () => {
    setediting(true);
    seteditval(reply.reply);
  };

  // function to save edited comment
  const saveReply = (e) => {
    e.preventDefault();
    setsaving(true);
    axios
      .patch(
        `${baseurl}/api/post/${postId}/comment/${commentId}/reply/${reply._id}/edit`,
        {
          reply: editval,
        }
      )
      .then((result) => {
        console.log(result);
        setsaving(false);
        setediting(false);
        getPost();
      })
      .catch((err) => {
        console.log(err);
        toast.error("server error");
        setsaving(false);
      });
  };
  return (
    <>
      <div className="reply flex gap-1">
        {deleting ? (
          <img
            src="/Fading wheel.gif"
            className="h-7 w-7 object-cover rounded-full"
          />
        ) : (
          <Link
            to={
              reply.userId == userdata?._id
                ? `/dash`
                : `/profile/${reply.userId}`
            }
          >
            <img
              src={reply.avatar}
              className="h-7 w-7 rounded-full object-cover"
            />
          </Link>
        )}
        <div>
          <div className="bg-blue-200 p-2 rounded w-full">
            <div className="flex items-center justify-between gap-5">
              <p className="font-semibold text-sm">{reply.username}</p>
              {!editing && reply.userId == userdata?._id && (
                <div className="flex gap-2">
                  <MdEditDocument
                    size="1rem"
                    color="green"
                    className="cursor-pointer"
                    onClick={editReply}
                  />
                  <FaTrashAlt
                    size="1rem"
                    color="red"
                    className="cursor-pointer"
                    onClick={deleteReply}
                  />
                </div>
              )}
            </div>
            {editing ? (
              <form className="relative" onSubmit={saveReply}>
                <textarea
                  rows="3"
                  cols="30"
                  className="outline-none border-2 border-black rounded bg-transparent p-2 text-sm w-full"
                  required
                  value={editval}
                  onChange={(e) => seteditval(e.target.value)}
                ></textarea>
                <button type="submit">
                  <div
                    className="rounded-full bg-green-700 w-fit p-2 h-fit absolute bottom-3 right-2"
                    title="save"
                  >
                    {saving ? (
                      <img
                        src="/Fading wheel.gif"
                        className="h-5 w-5 object-cover rounded-full"
                      />
                    ) : (
                      <RiSendPlane2Fill size="1.2rem" color="white" />
                    )}
                  </div>
                </button>
              </form>
            ) : (
              <p className="leading-4">
                <span className="font-semibold pr-2">{reply.commentUser}</span>
                {reply.reply}
              </p>
            )}
          </div>
          <div className="flex gap-2 items-center px-2">
            <p className="text-sm">{commentTimeGap(reply.replyDate)}</p>
            <p
              className="text-sm font-semibold hover:underline cursor-pointer"
              onClick={toggleReplyBox}
            >
              reply
            </p>
          </div>
          {/* reply box */}
          {showreplybox && (
            <form
              className="flex items-center gap-2 bg-emerald-800 p-2 rounded"
              onSubmit={replyAreply}
            >
              {replying ? (
                <img
                  src="/Fading wheel.gif"
                  className="h-7 w-7 object-cover rounded-full"
                />
              ) : (
                <Link to="/dash">
                  <img
                    src={userdata?.avatar}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                </Link>
              )}
              <input
                type="text"
                value={replyval}
                required
                onChange={(e) => setreplyval(e.target.value)}
                placeholder={`reply to ${reply.username}`}
                className="outline-none p-2 rounded-full bg-green-200 text-sm w-[90%]"
              />
              <button type="submit">
                <RiSendPlane2Fill
                  size="1.5rem"
                  color="white"
                  className="cursor-pointer"
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Reply;
