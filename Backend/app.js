const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User  = require('./models/User')
const Ticket = require('./models/Ticket');
const cookieParser = require('cookie-parser');
const Agent = require('./models/Agent')
const Admin = require('./models/Admin')
const Category = require('./models/Category')

const verifyAgentToken = require('./middleware/verifyagent');

dotenv.config();
connectDB();
const verifyToken = require('./middleware/verify');

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });


const app = express();
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // 🔥 This fixes your issue
app.use(express.urlencoded({ extended: true }));


// Test route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Register route
const jwt = require("jsonwebtoken");

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id },
      'sss',
      { expiresIn: '7d' }
    );

    // Optionally set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'success',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    // NOTE: In production, compare hashed passwords with bcrypt
    if (existingUser.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: existingUser._id },
      'sss', // Replace with env secret in production
      { expiresIn: '7d' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post("/addticket", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description required" });
    }

    const ticket = await Ticket.create({
      user: req.user.id,
      title,
      description,
      category,
      attachment: req.file?.buffer,
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (err) {
    console.error("Ticket create error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



app.get("/viewtickets", verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/agentlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    const agent = await Agent.findOne({ email });
    console.log("Agent from DB:", agent);

    if (!agent) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (password !== agent.password) {
      console.log("Password mismatch:", password, "!=", agent.password);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: agent._id }, "sss", { expiresIn: "7d" });
    res.json({
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
      },
    });
  } catch (err) {
    console.error("Agent login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/agentdashboard", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "sss"); // use your secret
    const agent = await Agent.findById(decoded.id);
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const tickets = await Ticket.find().populate("user").sort({ createdAt: -1 });

    res.json({ agent, tickets });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

app.post("/add-category", async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category exists" });

    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Category added" });
  } catch (err) {
    res.status(500).json({ message: "Error adding category" });
  }
});

app.delete("/delete-category/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category" });
  }
});



app.put("/ticket/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.status = status;
    await ticket.save();

    res.json({ message: "Status updated", ticket });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// POST /ticket/:id/comment
app.post("/ticket/:id/comment", async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.comments.push(message);
    await ticket.save();

    res.json({ message: "Comment added", ticket });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// routes/admin.js
app.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ adminId: admin._id }, "sss");
  res.json({ token });
});
app.get("/create-admin", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ email: "admin@quickdesk.com" });
    if (existingAdmin) {
      return res.status(400).send("⚠️ Admin already exists.");
    }

    const admin = new Admin({
      name: "Admin",
      email: "admin@quickdesk.com",
      password: "admin123", // plain text for testing only
    });

    await admin.save();
    res.send("✅ Admin created successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to create admin.");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
