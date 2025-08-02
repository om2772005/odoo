import { useEffect, useState } from "react";
import axios from "axios";

const AgentDashboard = () => {
  const [agent, setAgent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [commentMap, setCommentMap] = useState({});
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("agentToken");
    if (!token) return;

    axios
      .get("http://localhost:3000/agentdashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAgent(res.data.agent);
        setTickets(res.data.tickets);
      })
      .catch((err) => {
        console.error("Failed to fetch agent dashboard:", err);
      });
  }, []);

  const handleStatusChange = async (ticketId) => {
    const token = localStorage.getItem("agentToken");
    const newStatus = statusMap[ticketId];

    try {
      await axios.put(
        `http://localhost:3000/ticket/${ticketId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleCommentSubmit = async (ticketId) => {
    const token = localStorage.getItem("agentToken");
    const message = commentMap[ticketId];

    try {
      await axios.post(
        `http://localhost:3000/ticket/${ticketId}/comment`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, comments: [...ticket.comments, message] }
            : ticket
        )
      );

      setCommentMap((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold text-purple-400 mb-4">🎧 Agent Dashboard</h1>

      {agent ? (
        <>
          <div className="mb-8 bg-[#111111] border border-purple-500 rounded-2xl p-6 shadow-lg shadow-purple-600/10">
            <h2 className="text-2xl font-bold">Welcome, {agent.name} 👋</h2>
            <p className="text-gray-400">Email: {agent.email}</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-pink-400 mb-4">Assigned Tickets</h3>

            {tickets.length === 0 ? (
              <p className="text-gray-500">No tickets assigned yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="bg-zinc-800 p-6 rounded-xl border border-purple-700 shadow shadow-purple-700/10"
                  >
                    <h4 className="text-xl font-semibold text-purple-300 mb-2">{ticket.title}</h4>
                    <p className="text-gray-300 mb-2">{ticket.description}</p>
                    <p className="text-sm text-gray-500">From: {ticket.user.email}</p>
                    <p className="text-sm text-gray-500 mb-2">Status: <span className="font-semibold text-yellow-400">{ticket.status}</span></p>

                    <select
                      value={statusMap[ticket._id] || ticket.status}
                      onChange={(e) =>
                        setStatusMap({ ...statusMap, [ticket._id]: e.target.value })
                      }
                      className="w-full bg-zinc-700 text-white p-2 rounded-lg mb-2"
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>
                    <button
                      onClick={() => handleStatusChange(ticket._id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl mb-4"
                    >
                      Update Status
                    </button>

                    <textarea
                      rows={2}
                      placeholder="Add comment..."
                      value={commentMap[ticket._id] || ""}
                      onChange={(e) =>
                        setCommentMap({ ...commentMap, [ticket._id]: e.target.value })
                      }
                      className="w-full p-2 rounded-lg bg-zinc-700 text-white mb-2"
                    />

                    <button
                      onClick={() => handleCommentSubmit(ticket._id)}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl"
                    >
                      Add Comment
                    </button>

                    {ticket.comments?.length > 0 && (
                      <div className="mt-4 text-sm text-gray-400">
                        <h5 className="font-semibold mb-1 text-purple-300">Comments:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {ticket.comments.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500">Loading agent info...</p>
      )}
    </div>
  );
};

export default AgentDashboard;
