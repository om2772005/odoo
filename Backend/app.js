const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User  = require('./models/User')
const Ticket = require('./models/Ticket');
const cookieParser = require('cookie-parser');
const Agent = require('./models/Agent')



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
// POST /createsampleagent
app.post("/createsampleagent", async (req, res) => {
  try {
    const agent = new Agent({
      name: "Test Agent",
      email: "agent@example.com",
      password: "123456", // No hashing, just raw
    });

    await agent.save();
    res.status(201).json({ message: "Sample agent created", agent });
  } catch (err) {
    console.error("Error creating agent:", err);
    res.status(500).json({ error: "Agent creation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
