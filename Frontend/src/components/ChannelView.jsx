import { useState, useEffect } from "react";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function ChannelView() {
  const { id } = useParams(); // Channel ID from URL params
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar state
  const [channelData, setChannelData] = useState(null); // Channel data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [bannerImage, setBannerImage] = useState(
    localStorage.getItem(`channelBanner_${id}`) || ""
  ); // Banner image state
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem(`channelProfile_${id}`) || ""
  ); // Profile image state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility for video upload
  const [videos, setVideos] = useState([]); // List of videos for the channel
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
  }); // Video data for uploading
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const username = localStorage.getItem("username"); // Get username from localStorage
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchChannelById(); // Fetch channel details when component mounts
    handledelete(); // Check and handle video deletion
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchVideosByChannel(id); // Fetch videos if channel ID exists
    }
  }, [id]);

  // Fetch channel data by ID
  const fetchChannelById = async () => {
    const url = `http://localhost:5100/api/getchannels/${id}`;
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(url, {
        headers: { authorization: `Bearer ${token}` }, // Pass token in header
      });

      if (response.data) {
        setChannelData(response.data); // Set channel data if response is successful
      } else {
        setError("Failed to fetch channel data.");
      }
    } catch (err) {
      setError("Error fetching channel data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch videos for the specific channel
  const fetchVideosByChannel = async (channelId) => {
    const url = `http://localhost:5100/api/getvideos/${channelId}`;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(url, {
        headers: { authorization: `Bearer ${token}` }, // Pass token in header
      });

      if (response.data) {
        setVideos(response.data); // Set the list of videos
      } else {
        console.error("No videos found for the channel.");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed); // Toggle sidebar collapse state
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear localStorage on logout
    navigate("/form"); // Redirect to login page
  };

  // Handle image uploads (profile/banner)
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]; // Get the file from the input
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        if (type === "banner") {
          setBannerImage(imageData); // Set banner image
          localStorage.setItem(`channelBanner_${id}`, imageData); // Store in localStorage
        } else {
          setProfileImage(imageData); // Set profile image
          localStorage.setItem(`channelProfile_${id}`, imageData); // Store in localStorage
        }
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
  };

  // Handle changes in video data (form fields)
  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoData({ ...videoData, [name]: value }); // Update corresponding video data field
  };

  // Handle video submission (upload)
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Authentication token is missing.");
      return;
    }

    try {
      const url = "http://localhost:5100/api/createVideo";
      const response = await axios.post(
        url,
        {
          ...videoData, // Send video data
          channelId: channelData?._id,
          channelName: channelData?.channelName,
        },
        {
          headers: {
            authorization: `Bearer ${token}`, // Pass token in header
          },
        }
      );

      setSuccessMessage("Video uploaded successfully!"); // Success message on success
      setVideoData({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        channelName: "",
      }); // Reset video data
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error uploading video:", error);
      setErrorMessage(
        error.response?.data?.error || error.message || "Something went wrong."
      ); // Error handling
    }
  };

  // Handle video deletion
  const handledelete = async (videoId) => {
    const url = `http://localhost:5100/api/deleteVideo/${videoId}`;
    const token = localStorage.getItem("token");

    try {
      await axios.delete(url, {
        headers: { authorization: `Bearer ${token}` },
      }); // Send delete request
      setVideos(videos.filter((video) => video._id !== videoId)); // Remove video from UI after successful delete
    } catch (err) {
      console.error("Error deleting video:", err); // Error handling
    }
  };

  return (
    <div>
      <div className="sticky top-0 bg-white z-50">
        <Header toggleSidebar={handleToggle} />{" "}
        {/* Header with toggle for sidebar */}
      </div>

      <div
        className="sidebar-container"
        style={{ display: isCollapsed ? "block" : "none" }}
      >
        <Sidebar /> {/* Sidebar component */}
      </div>

      <div className="container p-2 flex flex-col items-end text-sm">
        <h1 className="text-sm font-bold text-left mb-2">Channel Details</h1>
        <p>Channel ID: {id}</p>
        <p>Username: {username}</p>
        <button
          className="px-2 py-2 mt-4 text-sm font-semibold bg-blue-600 text-white rounded-lg"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>

      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-4xl mt-2">
        {loading ? (
          <p>Loading channel data...</p> // Display loading text
        ) : error ? (
          <p className="text-red-500">Error: {error}</p> // Display error message
        ) : (
          <div>
            {/* Banner Image Section */}
            <div className="w-full h-48 bg-black flex justify-center items-center rounded-t-lg">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <h1 className="text-4xl text-white font-bold">
                  {channelData?.channelName || "Channel Banner"}
                </h1>
              )}
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Banner Image
              </label>
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, "banner")}
                accept="image/*"
                className="mt-2 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>

            {/* Profile Image Section */}
            <div className="flex flex-col items-center mt-4 px-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full w-40 h-40 border-4 border-white -mt-12"
                />
              ) : (
                <div className="rounded-full w-40 h-40 bg-gray-200 flex justify-center items-center -mt-12">
                  <span className="text-2xl text-white">+</span>
                </div>
              )}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Profile Image
                </label>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, "profile")}
                  accept="image/*"
                  className="mt-2 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelView;
