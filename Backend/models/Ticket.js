const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    attachment: {
      type: String,
    },
    status: {
      type: String,
      default: "Open",
    },
    comments: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
