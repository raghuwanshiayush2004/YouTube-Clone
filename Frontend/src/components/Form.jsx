import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

// Form component for Register and Login functionality
const Form = () => {
  // State variables to manage form states and user data
  const [isCollapsed, setIsCollapsed] = useState(false);  // Manages sidebar toggle
  const [isRegister, setIsRegister] = useState(true);  // Determines if the form is for Register or Login
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });  // Form data
  const [message, setMessage] = useState("");  // Message to show errors or success
  const navigate = useNavigate();  // Hook to navigate after successful login

  // Toggle between Register and Login form
  const toggleForm = () => {
    setIsRegister(!isRegister);
    setFormData({ username: "", email: "", password: "" });  // Reset form data
    setMessage("");  // Clear message
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });  // Update specific field in form data
  };

  // Toggle the visibility of the sidebar
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle form submission for login or registration
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the form from reloading the page

    // URL changes based on whether the form is for login or registration
    const url = isRegister ? "http://localhost:5100/api/register" : "http://localhost:5100/api/login";

    try {
      // Send POST request to server with form data
      const response = await axios.post(url, formData);
      setMessage(response.data.message);  // Display response message

      // If login is successful, store user data in localStorage and redirect
      if (!isRegister && response.data.token) {
        localStorage.setItem("token", response.data.token);  // Store authentication token
        localStorage.setItem("username", formData.username);  // Store username
        localStorage.setItem("email", formData.email);  // Store email
        localStorage.setItem("profilePic", response.data.profilePic || "");  // Store profile picture URL (optional)
        
        navigate("/");  // Redirect to homepage after successful login
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong");  // Handle any errors
    }
  };

  return (
    <>
      {/* Header with sidebar toggle */}
      <div className="sticky top-0 bg-white z-50">
        <Header toggleSidebar={handleToggle} />
      </div>

      {/* Sidebar that appears/disappears based on isCollapsed state */}
      <div
        className="sidebar-container"
        style={{
          display: isCollapsed ? "block" : "none",  // Conditional display of sidebar
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

      {/* Main form container */}
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* Form title: Register or Login */}
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isRegister ? "Register" : "Login"}
          </h1>

          {/* Display error/success message */}
          {message && (
            <p className="text-center text-sm text-red-500 mb-4">{message}</p>
          )}

          {/* Form fields */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-200 rounded-md focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Email field (only visible in Register form) */}
            {isRegister && (
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-200 rounded-md focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            {/* Password field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-200 rounded-md focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          {/* Toggle between Register and Login forms */}
          <p className="mt-4 text-center text-sm">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={toggleForm} className="text-red-500 hover:underline">
              {isRegister ? "Login here" : "Register here"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Form;
