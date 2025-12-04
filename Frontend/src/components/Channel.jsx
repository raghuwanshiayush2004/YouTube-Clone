import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Channel() {
  // State variables for form toggling, editing, and storing channel info
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editChannelId, setEditChannelId] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [channels, setChannels] = useState([]); // State to hold all channels
  const [loading, setLoading] = useState(false); // State to handle loading status
  const navigate = useNavigate(); // Navigate to different routes

  // Fetch channels when the component mounts
  useEffect(() => {
    fetchChannels();
  }, []);

  // Function to fetch channels from the server
  const fetchChannels = async () => {
    const url = "http://localhost:5100/api/getchannels";
    const token = localStorage.getItem("token");

    // Check if token exists
    if (!token) return console.error("Token not found in localStorage");

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      });

      // If request is successful, set channels
      if (response.ok) {
        const data = await response.json();
        setChannels(data);
      } else {
        console.error("Failed to fetch channels:", response.status);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  // Toggle the form to create/edit channels
  const toggleForm = () => {
    setIsOpen(!isOpen); // Toggle form visibility
    setIsEditing(false); // Reset editing status
    resetForm(); // Reset form fields
  };

  // Function to reset form fields
  const resetForm = () => {
    setChannelName("");
    setChannelDescription("");
  };

  // Handle channel creation
  const handleCreateChannel = async (event) => {
    event.preventDefault(); // Prevent form default behavior
    setLoading(true); // Set loading state to true while request is in progress

    const token = localStorage.getItem("token");
    const url = "http://localhost:5100/api/createChannel";

    // Data for the new channel
    const data = {
      channelName,
      channelDescription,};

    // Check if token exists
    if (!token) return console.error("Token not found in localStorage");

    try {
      const response = await axios.post(url, data, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Add new channel to the state
      const newChannel = response.data;
      setChannels([...channels, newChannel]);

      resetForm();
      setIsOpen(false); // Close form
      setLoading(false); // Set loading to false after operation
    } catch (error) {
      console.error("Error creating channel:", error);
      setLoading(false);
    }
  };

  // Handle channel update
  const handleUpdateChannel = async (event) => {
    event.preventDefault(); // Prevent form default behavior
    setLoading(true); // Set loading state to true while request is in progress

    const token = localStorage.getItem("token");
    const url = `http://localhost:5100/api/updateChannel/${editChannelId}`;

    // Data for updating channel
    const data = {
      channelName,
      channelDescription,
    };

    // Check if token exists
    if (!token) return console.error("Token not found in localStorage");

    try {
      const response = await axios.put(url, data, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Update the channel in the state after successful update
      const updatedChannels = channels.map((channel) =>
        channel._id === editChannelId
          ? { ...channel, channelName, channelDescription }
          : channel
      );
      setChannels(updatedChannels);

      resetForm();
      setIsOpen(false); // Close form
      setLoading(false); // Set loading to false after operation
    } catch (error) {
      console.error("Error updating channel:", error);
      setLoading(false);
    }
  };

  // Function to delete a channel
  const deleteChannel = async (channelId) => {
    const url = `http://localhost:5100/api/deleteChannel/${channelId}`;
    const token = localStorage.getItem("token");

    // Check if token exists
    if (!token) return console.error("Token not found in localStorage");

    try {
      await axios.delete(url, {
        headers: { authorization: `Bearer ${token}` },
      });
      setChannels(channels.filter((channel) => channel._id !== channelId)); // Remove deleted channel from state
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  // Function to edit a channel (populate form with existing channel data)
  const editChannel = (channelId, name, description) => {
    setIsOpen(true); // Open form
    setIsEditing(true); // Set editing status
    setEditChannelId(channelId); // Set the channel to be edited
    setChannelName(name); // Pre-fill channel name
    setChannelDescription(description); // Pre-fill channel description
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Channels</h1>

      {/* Button to toggle form for creating a new channel */}
      <div className="text-center">
        <button
          onClick={toggleForm}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-4"
        >
          Create Channel
        </button>
      </div>

      {/* Display the list of channels */}
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="mt-10"
      >
        {channels.map((channel) => (
          <div
            key={channel._id}
            className="bg-white p-6 rounded-lg shadow-lg border text-center w-full sm:w-[350px] lg:w-[400px]"
          >
            <h3 className="text-2xl font-semibold">{channel.channelName}</h3>
            <p className="text-gray-600 mt-2">{channel.channelDescription}</p>
            <div className="mt-4">
              {/* Button to delete channel */}
              <button
                onClick={() => deleteChannel(channel._id)}
                className="bg-red-500 text-white px-6 py-3 rounded-lg mt-4"
              >
                Delete
              </button>
              {/* Button to edit channel */}
              <button
                onClick={() =>
                  editChannel(
                    channel._id,
                    channel.channelName,
                    channel.channelDescription
                  )
                }
                className="bg-green-500 text-white px-6 py-3 rounded-lg mt-4 ml-4"
              >
                Edit
              </button>
              {/* Button to view channel details */}
              <button
                onClick={() => navigate(`/channel/${channel._id}`)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg mt-4 ml-4"
              >
                View Channel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form modal for creating or editing a channel */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 relative">
            <button
              onClick={toggleForm} // Close the form modal
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            {/* Form for creating or editing channel */}
            {isEditing ? (
              <form onSubmit={handleUpdateChannel}>
                <h2 className="text-xl font-semibold mb-4">Edit Channel</h2>
                <div className="mb-4">
                  <label
                    htmlFor="channelName"
                    className="block text-gray-700 font-semibold"
                  >
                    Channel Name
                  </label>
                  <input
                    type="text"
                    id="channelName"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    placeholder="Enter channel name"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="channelDesc"
                    className="block text-gray-700 font-semibold"
                  >
                    Channel Description
                  </label>
                  <textarea
                    id="channelDesc"
                    value={channelDescription}
                    onChange={(e) => setChannelDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    placeholder="Enter channel description"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-green-500 text-white px-4 py-2 rounded-lg mt-4 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Updating..." : "Update Channel"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateChannel}>
                <h2 className="text-xl font-semibold mb-4">Create Channel</h2>
                <div className="mb-4">
                  <label
                    htmlFor="channelName"
                    className="block text-gray-700 font-semibold"
                  >
                    Channel Name
                  </label>
                  <input
                    type="text"
                    id="channelName"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    placeholder="Enter channel name"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="channelDesc"
                    className="block text-gray-700 font-semibold"
                  >
                    Channel Description
                  </label>
                  <textarea
                    id="channelDesc"
                    value={channelDescription}
                    onChange={(e) => setChannelDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    placeholder="Enter channel description"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-green-500 text-white px-4 py-2 rounded-lg mt-4 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Create Channel"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Channel;
