import { Link } from "react-router-dom";

const SelectLogin = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-12">
      <h1 className="text-5xl font-extrabold text-cyan-400 mb-4 neon-text">⚡ QuickDesk</h1>
      <p className="text-gray-400 text-lg mb-12 text-center max-w-xl">
        Choose your portal and take control of the support universe.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
        <Link to="/user" className="w-full">
          <div className="bg-[#111111] border border-cyan-400 rounded-2xl p-8 text-center shadow-[0_0_25px_rgba(0,255,255,0.2)] hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-cyan-300">👤 User Login</h2>
            <p className="text-gray-400 text-sm mb-6">Access your tickets, track updates, and raise new ones.</p>
            <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-xl">
              Enter as User
            </button>
          </div>
        </Link>

        <Link to="agentlogin" className="w-full">
          <div className="bg-[#111111] border border-purple-500 rounded-2xl p-8 text-center shadow-[0_0_25px_rgba(180,0,255,0.2)] hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-purple-300">🛠️ Agent Login</h2>
            <p className="text-gray-400 text-sm mb-6">Pick tickets, respond to users, and solve issues efficiently.</p>
            <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-black font-semibold rounded-xl">
              Enter as Agent
            </button>
          </div>
        </Link>

        <Link to="/adminlogin" className="w-full">
          <div className="bg-[#111111] border border-red-500 rounded-2xl p-8 text-center shadow-[0_0_25px_rgba(255,0,0,0.2)] hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-red-300">🧠 Admin Login</h2>
            <p className="text-gray-400 text-sm mb-6">Manage categories, users, and monitor ticket flow.</p>
            <button className="w-full py-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-black font-semibold rounded-xl">
              Enter as Admin
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SelectLogin;
