import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, {
  withCredentials: true
});

      if (response.data.success) {
        navigate('/userdashboard')
      } else {
        toast.error(response.data.message || "Registration failed.");
         navigate('/userdashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-12">
      <h1 className="text-5xl font-extrabold text-cyan-400 mb-4 neon-text">🚀 Register</h1>
      <p className="text-gray-400 text-lg mb-10 text-center max-w-xl">
        Create a new QuickDesk account to raise and manage your support tickets.
      </p>

      <div className="bg-[#111111] border border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.15)] rounded-2xl p-10 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-900 border border-cyan-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-900 border border-cyan-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-900 border border-cyan-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl shadow-md shadow-cyan-500/20 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/user" className="text-cyan-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegisterPage;
