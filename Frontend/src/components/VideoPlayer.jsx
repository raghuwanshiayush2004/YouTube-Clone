import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiLike, BiDislike } from "react-icons/bi";
import { PiShareFatLight } from "react-icons/pi";
import { RxDownload } from "react-icons/rx";
import SideVideoGrid from "./SideVideoGrid";
import Header from "../components/Header";
import Sidebar from "./Sidebar";
import axios from "axios";

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const navigate = useNavigate();

  // Fetch video details from the API
  const fetchVideo = async () => {
    const url = "http://localhost:5100/api/getVideos";
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(url, {
        headers: { authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const foundVideo = response.data.find((video) => video._id === id);
        setVideo(foundVideo);
        const savedLikes = localStorage.getItem(`likes_${id}`);
        const savedDislikes = localStorage.getItem(`dislikes_${id}`);
        
        setLikes(savedLikes ? parseInt(savedLikes) : foundVideo.likes || 0);
        setDislikes(savedDislikes ? parseInt(savedDislikes) : foundVideo.dislikes || 0);
      } else {
        console.error("Failed to fetch video details");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for the video
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5100/api/getComments/${id}`
      );
      if (response.status === 200) {
        setComments(response.data);
      } else {
        console.error("Failed to fetch comments:", response.status);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [id]);

  // Toggle the sidebar visibility
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Add a new comment to the video
  const addComment = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty");

    const username = localStorage.getItem("username");
    const commentData = {
      text: newComment,
      userId: "userId", // Replace with actual userId
      videoId: video._id,
      channelName: username,
    };

    try {
      const response = await axios.post(
        "http://localhost:5100/api/createComment",
        commentData,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const newCommentObj = response.data;
        setComments((prevComments) => {
          const updatedComments = [newCommentObj, ...prevComments];
          localStorage.setItem("comments", JSON.stringify(updatedComments));
          return updatedComments;
        });
        setNewComment("");
      } else {
        console.error("Failed to post comment:", response.status);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Delete a comment from the video
  const deleteComment = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5100/api/deleteComment/${id}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setComments((prevComments) => {
          const updatedComments = prevComments.filter(
            (comment) => comment._id !== id
          );
          localStorage.setItem("comments", JSON.stringify(updatedComments));
          return updatedComments;
        });
      } else {
        console.error("Failed to delete comment:", response.status);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Handle like functionality
  const handleLike = () => {
    setLikes((prevLikes) => {
      const newLikes = Number(prevLikes + 1);
      localStorage.setItem(`likes_${id}`, newLikes);
      return newLikes;
    });
  };

  // Handle dislike functionality
  const handleDislike = () => {
    setDislikes((prevDislikes) => {
      const newDislikes = Number(prevDislikes + 1);
      localStorage.setItem(`dislikes_${id}`, newDislikes);
      return newDislikes;
    });
  };

  // Edit a comment
  const editComment = async (commentId) => {
    setEditCommentId(commentId);
    const commentToEdit = comments.find((comment) => comment._id === commentId);
    setEditCommentText(commentToEdit.text);
  };

  // Save the edited comment
  const saveEditedComment = async () => {
    if (!editCommentText.trim()) return alert("Comment cannot be empty");

    try {
      const response = await axios.put(
        `http://localhost:5100/api/editComment/${editCommentId}`,
        { text: editCommentText },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setComments((prevComments) => {
          return prevComments.map((comment) =>
            comment._id === editCommentId
              ? { ...comment, text: editCommentText }
              : comment
          );
        });
        setEditCommentId(null);
        setEditCommentText("");
      } else {
        console.error("Failed to edit comment:", response.status);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // Cancel editing a comment
  const cancelEdit = () => {
    setEditCommentId(null);
    setEditCommentText("");
  };

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [fetchComments, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <>
      <div className="sticky top-0 bg-white z-50">
        <Header toggleSidebar={handleToggle} />
      </div>

      <div
        className="sidebar-container"
        style={{
          display: isCollapsed ? "block" : "none",
          position: "fixed",
          left: 0,
          width: "220px",
          height: "100vh",
          backgroundColor: "white",
          transition: "transform 0.3s ease",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        <Sidebar />
      </div>

      <div
        className="flex flex-col md:flex-row p-2 space-x-2 overflow-x-hidden scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Video Section */}
        <div className="flex-1 max-w-full bg-white rounded-lg p-4 space-y-6 mx-auto">
          <div className="relative">
            <video
              src={video.videoUrl}
              className="w-full h-auto rounded-lg"
              controls
            ></video>

            <div className="flex justify-between items-center mt-2">
              <div>
                <h2 className="text-xl font-semibold">{video.title}</h2>
                <p>{video.channelName}</p>
              </div>

              <div className="flex space-x-4">
                <button onClick={handleLike}>
                  <BiLike className="text-2xl" />
                  <span>{likes}</span>
                </button>
                <button onClick={handleDislike}>
                  <BiDislike className="text-2xl" />
                  <span>{dislikes}</span>
                </button>
                <button>
                  <PiShareFatLight className="text-2xl" />
                </button>
                <button>
                  <RxDownload className="text-2xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Comments</h3>

            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 w-full"
                placeholder="Add a comment..."
              />
              <button
                onClick={addComment}
                className="bg-blue-500 text-white rounded-md p-2 mt-2 w-full"
              >
                Add Comment
              </button>
            </div>

            <div className="space-y-4 mt-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-white p-4 rounded-lg shadow-md flex items-start space-x-4"
                >
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">
                        {comment.channelName}
                      </span>
                    </div>

                    <div>
                      {editCommentId === comment._id ? (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="border-2 border-gray-300 rounded-md p-2 w-full"
                          />
                          <button
                            onClick={saveEditedComment}
                            className="bg-green-500 text-white rounded-md p-2 mt-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-red-500 text-white rounded-md p-2 mt-2 ml-2"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-700">{comment.text}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-x-2">
                    <button
                      onClick={() => editComment(comment._id)}
                      className="bg-yellow-500 text-white p-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="bg-red-500 text-white p-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Video Grid */}
        <SideVideoGrid />
      </div>
    </>
  );
}

export default VideoPlayer;
