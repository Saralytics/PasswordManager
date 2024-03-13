import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import StorePasswordForm from "./pages/PasswordForm";
import { AuthProvider } from './utils/AuthContext';
import LogoutButton from "./components/LogoutButton";


// import axios from "axios";
// import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
          {/* <div> */}
        {/* {isAuthenticated ? (
          <p>Hi {userName}, you are logged in</p>
        ) : (
          <p>Welcome to Password Manager.</p>
        )}
      </div> */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/new-password" element={<StorePasswordForm />} />
            <Route path="/logout" element={<LogoutButton />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
    
  );
}

export default App;





// import axios from "axios";
// import { useState } from "react";
// import "./App.css";

// function App() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState(""); // Add an email state for registration


//   const login = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "https://27c7-217-164-202-47.ngrok-free.app/api/auth/",
//         {
//           username,
//           password,
//         },
//         { withCredentials: true }
//       );
//       console.log(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const register = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "https://27c7-217-164-202-47.ngrok-free.app/api/register/",
//         {
//           username,
//           email,
//           password,
//         },
//       );
//       console.log(res.data);
//     } catch (error) {
//       console.log(error.response.data); // Log error response data
//     }
//   };

//   return (
//     <div className="App">
//       {/* Login Form */}
//       <form onSubmit={login}>
//         <div>
//           <label>Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <input type="submit" value="Login" />
//       </form>

//       {/* Registration Form */}
//       <form onSubmit={register}>
//         <div>
//           <label>Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <input type="submit" value="Register" />
//       </form>
//     </div>
//   );
// }

// export default App;