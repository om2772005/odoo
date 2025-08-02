import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:3000/adminlogin", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      navigate("/admindashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-12">
      <h1 className="text-5xl font-extrabold text-blue-400 mb-4">🛠️ Admin Login</h1>
      <p className="text-gray-400 text-lg mb-10 text-center max-w-xl">
        Admins can manage tickets, categories, and agents.
      </p>

      <div className="bg-[#111111] border border-blue-500 shadow-[0_0_30px_rgba(0,128,255,0.15)] rounded-2xl p-10 w-full max-w-md">
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
              className="w-full px-4 py-2 bg-zinc-900 border border-blue-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 bg-zinc-900 border border-blue-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-black font-bold rounded-xl shadow-md shadow-blue-500/20 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Agent?{" "}
          <Link to="/agentlogin" className="text-blue-400 hover:underline">
            Go to Agent Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
