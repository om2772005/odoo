import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AgentLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:3000/agentlogin", {
        email,
        password,
      });

      localStorage.setItem("agentToken", res.data.token);
      navigate("/agentdashboard"); // adjust route as needed
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-12">
      <h1 className="text-5xl font-extrabold text-purple-400 mb-4">🛡️ Agent Login</h1>
      <p className="text-gray-400 text-lg mb-10 text-center max-w-xl">
        Login to handle assigned tickets and assist users.
      </p>

      <div className="bg-[#111111] border border-purple-500 shadow-[0_0_30px_rgba(128,0,255,0.15)] rounded-2xl p-10 w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
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
              className="w-full px-4 py-2 bg-zinc-900 border border-purple-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full px-4 py-2 bg-zinc-900 border border-purple-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-black font-bold rounded-xl shadow-md shadow-purple-500/20 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Admin?{" "}
          <Link to="/adminlogin" className="text-purple-400 hover:underline">
            Go to Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AgentLoginPage;
