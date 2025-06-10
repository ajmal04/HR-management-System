var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var withAuth = require("./withAuth");

require("dotenv").config();

const { errorHandler } = require("./utils/errorHandler");
const db = require("./models");

// Route imports
const api = require("./routes/api");
const login = require("./routes/login/login.routes");
const register = require("./routes/register/register.routes");
const onboarding = require("./routes/onboarding.routes");

const resignationRoutes = require("./routes/resignation.routes");
const documentRoutes = require("./routes/document.routes");
// const recruitmentRoutes = require("./routes/recruitment.routes");
const requisitionRoutes = require("./routes/jobRequisition.routes");
const collegeAnnouncementRoutes = require("./routes/collegeAnnouncement.routes");
const collegeEventRoutes = require("./routes/collegeEvent.routes");
const departmentEventRoutes = require("./routes/departmentEvent.routes");

var app = express();

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS Setup
app.use(
  cors({
    origin: "http://localhost:3000", // adjust for deployment
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Sync database
db.sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced successfully.");
});

// Route registration
app.use("/api", api);
app.use("/login", login);
app.use("/register", register);
app.use("/onboarding", onboarding);
app.use("/api/resignations", resignationRoutes);
app.use("/api/documents", documentRoutes);
// app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/requisition", requisitionRoutes);
app.use("/api/collegeAnnouncements", collegeAnnouncementRoutes);
app.use("/api/collegeEvents", collegeEventRoutes);
app.use("/api/departmentEvents", departmentEventRoutes);

// Token check route
app.get("/checkToken", withAuth.checkToken);

// Root route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running 🚀" });
});

// Serve static frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    error: {
      status: 404,
      message: "The requested resource was not found on this server",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: {
      status,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
});

module.exports = app;
