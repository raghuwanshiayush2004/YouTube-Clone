```markdown
# YouTube Clone using MERN Stack
 github Link : https://github.com/raghuwanshiayush2004/YouTube-Clone

## Objective
The objective of this project is to build a full-stack YouTube clone where users can view, interact with videos, and perform actions like commenting, liking, and creating a channel. This project demonstrates how to create a real-world application using the MERN stack (MongoDB, Express, React, and Node.js).

## Features
- **Home Page**: Displays YouTube header, sidebar, filter buttons, and a grid of video thumbnails.
- **User Authentication**: Allows users to register, log in, and sign in via JWT authentication.
- **Search & Filter**: Implement search functionality to filter videos based on titles and categories.
- **Video Player Page**: Users can watch videos, interact with comments, and like or dislike videos.
- **Channel Page**: Users can create and manage their channels, and edit/delete videos.
- **Responsive Design**: Fully responsive across devices (desktop, tablet, mobile).

## Tech Stack
- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas or local instance)
- **Authentication**: JWT (JSON Web Tokens)

## Requirements

### Front-End
1. **Home Page**:
   - YouTube header, sidebar (toggleable), filter buttons, and video grid.
   - Each video card displays the title, thumbnail, channel name, and views.
2. **User Authentication**:
   - Users can register and log in using username, email, and password with JWT-based authentication.
   - After signing in, the user's name is displayed at the top.
3. **Search & Filter**:
   - Search bar for searching videos by title.
   - Filter buttons to filter videos by category.
4. **Video Player Page**:
   - Displays the selected video along with title, description, likes/dislikes, and comment section.
   - Users can add, edit, or delete comments.
5. **Channel Page**:
   - Users can create a channel (after sign-in), display their videos, and edit/delete their videos.
6. **Responsive Design**:
   - Ensured the layout works well on mobile, tablet, and desktop.

### Back-End
1. **API Endpoints**:
   - **User Authentication**: Sign-up, login, and JWT-based authentication routes.
   - **Channel Management**: API to create and fetch channels.
   - **Video Management**: API to fetch, update, and delete videos.
   - **Comments**: API to add and fetch comments.
2. **Database**: MongoDB to store users, videos, channels, and comments.

## Setup
### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/raghuwanshiayush2004/YouTube-Clone.git
   ```

2. Navigate to the project directory:

   ```bash
   cd YouTube-Clone-main
   ```

3. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Install frontend dependencies:

   ```bash
   npm install
   ```

5. Set up environment variables:
   - In the **backend** directory add the following:

     ```
     JWT_SECRET=your_jwt_secret
     MONGO_URI=your_mongodb_connection_string
     ```

6. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

7. Start the frontend server:

   ```bash
   cd frontend
   npm run dev
   ```

8. Visit `http://localhost:5100` to access the application.

### Prerequisites

- Node.js
- npm
- MongoDB

## Usage

- **Home Page**: The homepage displays a grid of videos with thumbnails, titles, and other details.
- **Search**: Use the search bar to find videos by title.
- **Sign In**: Click the "Sign In" button in the header, sign in via JWT-based authentication, and view personalized content.
- **Video Page**: Click on a video to view its player, comments, and interact by liking/disliking or commenting.
- **Channel**: After signing in, users can create and manage their channels, upload, edit, or delete videos.

## Features Demonstrated

1. **React** for building the front-end with state management using `useState`, `useEffect`, and `React Router`.
2. **Node.js & Express** for back-end API development with JWT-based authentication.
3. **MongoDB** for storing user, video, channel, and comment data.
4. **Responsive Design** to ensure the app is fully functional across all devices.
