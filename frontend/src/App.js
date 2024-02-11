import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Add an email state for registration


  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://27c7-217-164-202-47.ngrok-free.app/api/auth/",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://27c7-217-164-202-47.ngrok-free.app/api/register/",
        {
          username,
          email,
          password,
        },
      );
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data); // Log error response data
    }
  };

  return (
    <div className="App">
      {/* Login Form */}
      <form onSubmit={login}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input type="submit" value="Login" />
      </form>

      {/* Registration Form */}
      <form onSubmit={register}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default App;