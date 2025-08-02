import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login success:", res.data);
      navigate("/userdashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-12">
      <h1 className="text-5xl font-extrabold text-cyan-400 mb-4 neon-text">👤 User Login</h1>
      <p className="text-gray-400 text-lg mb-10 text-center max-w-xl">
        Welcome back. Login to track and manage your support tickets.
      </p>

      <div className="bg-[#111111] border border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.15)] rounded-2xl p-10 w-full max-w-md">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-cyan-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-cyan-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl shadow-md shadow-cyan-500/20 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/userregister" className="text-cyan-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLoginPage;
