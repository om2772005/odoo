    import { useEffect, useState } from "react";
    import axios from "axios";
    import { motion } from "framer-motion";

    const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [ticketRes, categoryRes] = await Promise.all([
            axios.get("http://localhost:3000/agentdashboard", config),
            axios.get("http://localhost:3000/categories", config),
        ]);

        setTickets(ticketRes.data);
        setCategories(categoryRes.data);
        } catch (err) {
        console.error("Error loading dashboard:", err);
        } finally {
        setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.post("http://localhost:3000/add-category", { name: newCategory }, config);
        setNewCategory("");
        fetchAll();
        } catch (err) {
        console.error("Add category failed:", err);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.delete(`http://localhost:3000/delete-category/${id}`, config);
        fetchAll();
        } catch (err) {
        console.error("Delete category failed:", err);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    if (loading) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10">
        <h1 className="text-4xl font-bold text-purple-400 mb-6">🛠️ Admin Dashboard</h1>

        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Tickets Section */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-purple-600 shadow-md overflow-auto max-h-[500px]">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">🎫 All Tickets</h2>
            {tickets.length === 0 ? (
                <p className="text-gray-400">No tickets available.</p>
            ) : (
                <ul className="space-y-4">
                {tickets.map((ticket) => (
                    <li key={ticket._id} className="border-b border-zinc-700 pb-2">
                    <p className="font-semibold text-white">{ticket.subject}</p>
                    <p className="text-gray-400 text-sm">From: {ticket.userEmail}</p>
                    <p className="text-gray-500 text-xs">Category: {ticket.category}</p>
                    </li>
                ))}
                </ul>
            )}
            </div>

            {/* Category Management */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-pink-600 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-pink-300">📁 Manage Categories</h2>

            <div className="flex mb-4">
                <input
                type="text"
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-4 py-2 bg-zinc-800 border border-pink-600 rounded-l-xl text-white focus:outline-none"
                />
                <button
                onClick={handleAddCategory}
                className="px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-black font-bold rounded-r-xl hover:from-pink-400 hover:to-purple-500 transition"
                >
                Add
                </button>
            </div>

            {categories.length === 0 ? (
                <p className="text-gray-400">No categories yet.</p>
            ) : (
                <ul className="space-y-3">
                {categories.map((cat) => (
                    <li
                    key={cat._id}
                    className="flex justify-between items-center bg-zinc-800 px-4 py-2 rounded-xl"
                    >
                    <span className="text-white">{cat.name}</span>
                    <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="text-red-400 hover:underline text-sm"
                    >
                        Delete
                    </button>
                    </li>
                ))}
                </ul>
            )}
            </div>
        </motion.div>
        </div>
    );
    };

    export default AdminDashboard;
