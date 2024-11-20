// server.js
import express from "express";
import { connect, Schema, model } from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors());
app.use(express.json());  // Enable JSON parsing for incoming requests
app.use(bodyParser.json());

// Connect to MongoDB
connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

// User schema and model
const userSchema = new Schema({
  name: String,
  email: String,
  age: Number,
  contactNo: String,
});

const User = model("User", userSchema);

// POST endpoint to add user data
app.post("/api/login", async (req, res) => {
  const { name, email, age, course, contactNo } = req.body;
  try {
    const newUser = new User({ name, email, age, course, contactNo });
    await newUser.save();
    res.status(201).json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ message: "Failed to save user data", error });
  }
});

// Enrollment
// Schema for Enrollment
const enrollmentSchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  email: {
    type: String,
   
  },
  age: {
    type: Number,
    
  },
  courseName: {
    
  },
});

// Model for Enrollment
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

// Routes
app.post("/api/enroll", async (req, res) => {
  const { name, email, age, courseName } = req.body;

  // Validate request body
  if (!name || !email || !age || !courseName) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Create a new enrollment
  const newEnrollment = new Enrollment({
    name,
    email,
    age,
    courseName,
  });

  try {
    await newEnrollment.save();
    res.status(201).json({ message: "Enrollment successful!" });
  } catch (err) {
    console.error("Error saving enrollment:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

// contact form
// MongoDB Schema and Model
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", ContactSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Contact API is running");
});

// Endpoint to handle form submission
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.status(201).json({ message: "Contact saved successfully" });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ message: "Failed to save contact" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
