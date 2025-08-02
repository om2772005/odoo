import { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "",
    file: null,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchCategories();
    fetchTickets();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/categories");
      const cats = res.data.categories || res.data || [];
      setCategories(cats); // ✅ categories always as array of { _id, name }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:3000/viewtickets", {
        withCredentials: true,
      });
      setTickets(res.data.tickets);
      setFiltered(res.data.tickets);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  const applyFilters = () => {
    let filteredList = [...tickets];

    if (search.trim()) {
      filteredList = filteredList.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filteredList = filteredList.filter((t) => t.status === statusFilter);
    }

    if (categoryFilter !== "All") {
      filteredList = filteredList.filter((t) => t.category === categoryFilter);
    }

    if (sortBy === "mostReplied") {
      filteredList.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    } else {
      filteredList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    setFiltered(filteredList);
  };

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, categoryFilter, sortBy, tickets]);

  const handleTicketCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newTicket.title);
    formData.append("description", newTicket.description);
    formData.append("category", newTicket.category);
    if (newTicket.file) formData.append("file", newTicket.file);

    try {
      await axios.post("http://localhost:3000/addticket", formData, {
        withCredentials: true,
      });
      setShowForm(false);
      setNewTicket({ title: "", description: "", category: "", file: null });
      fetchTickets();
    } catch (err) {
      console.error("Error creating ticket:", err);
      alert("Error creating ticket");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">🎫 User Dashboard</h1>

      {/* Filter Inputs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search title or description..."
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-cyan-600 w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-cyan-600"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-cyan-600"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-cyan-600"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">📅 Recently Updated</option>
          <option value="mostReplied">🔥 Most Replied</option>
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="ml-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500"
        >
          ➕ Create Ticket
        </button>
      </div>

      {/* Ticket Creation Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-cyan-500 shadow-2xl w-full max-w-xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-red-400 text-xl hover:text-red-500"
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">🎫 Create New Ticket</h2>
            <form onSubmit={handleTicketCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                value={newTicket.title}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-cyan-400 rounded-lg"
              />
              <textarea
                placeholder="Description"
                required
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-cyan-400 rounded-lg"
                rows="4"
              />
              <select
                required
                value={newTicket.category}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, category: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-cyan-400 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="file"
                onChange={(e) =>
                  setNewTicket({ ...newTicket, file: e.target.files[0] })
                }
                className="w-full text-sm text-gray-300"
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-400 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-black font-semibold"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket List */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No matching tickets found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-zinc-900 p-5 rounded-lg border border-cyan-700 shadow-md"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-cyan-300">{ticket.title}</h3>
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    ticket.status === "Open"
                      ? "bg-green-700 text-white"
                      : "bg-red-700 text-white"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-yellow-400">📁 {ticket.category}</p>
              <p className="text-gray-300 mt-2">{ticket.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                🕓 Updated: {new Date(ticket.updatedAt).toLocaleString()}
              </p>

              {ticket.comments?.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-green-400">Agent Comments:</h4>
                  <ul className="text-gray-400 list-disc pl-5">
                    {ticket.comments.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
