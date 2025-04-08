// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/owner", ownerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// brfore refactorinn

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // מסלולים
// const authRoutes = require("./routes/authRoutes");
// const supplierRoutes = require("./routes/supplierRoutes");
// const ownerRoutes = require("./routes/ownerRoutes");

// app.use("/api/supplier", supplierRoutes); 
// app.use("/api/owner", ownerRoutes);      
// app.use("/api/auth", authRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

