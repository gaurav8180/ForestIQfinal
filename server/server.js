const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const treeCountRoutes = require("./routes/treeCountRoutes");
const treeSpecieRoute = require('./routes/treeSpecieRoutes');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for large image payloads

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tree-count", treeCountRoutes);
app.use('/api/tree-species', treeSpecieRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));