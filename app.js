var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var withAuth = require("./withAuth");

const { errorHandler } = require("./utils/errorHandler");
const resignationRoutes = require("./routes/resignation.routes");
const recruitmentRoutes = require("./routes/recruitment.routes");

const db = require("./models");
require("dotenv").config();

var api = require("./routes/api");
var login = require("./routes/login/login.routes");
var register = require("./routes/register/register.routes");
var onboarding = require("./routes/onboarding.routes");

var app = express();

// global.__basedir = __dirname;

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }

db.sequelize.sync({ alter: true });

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.use("/api", api);
app.use("/login", login);
app.use("/register", register);

app.use("/onboarding", onboarding);

// Error handling middleware
app.use(errorHandler);

app.use("/api/resignations", resignationRoutes);
app.use("/api/recruitment", recruitmentRoutes);

app.use(express.json());

app.get("/checkToken", withAuth.checkToken);

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies/auth headers
  })
);

// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running 🚀" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // For API routes, return JSON instead of forwarding to error handler
  res.status(404).json({
    success: false,
    message: "Resource not found",
    error: {
      status: 404,
      message: "The requested resource was not found on this server",
    },
  });
});

// error handler
app.use(function (err, req, res, next) {
  // Set error status code
  const status = err.status || 500;

  // Return JSON error response
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: {
      status: status,
      // Only show stack trace in development
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
});

module.exports = app;
