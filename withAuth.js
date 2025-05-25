const jwt = require("jsonwebtoken");
const db = require("./models");
const User = db.user;

/**
 * Middleware to verify JWT token
 */
exports.checkToken = async (req, res) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader === "undefined") {
      return res
        .status(401)
        .json({ message: "Access denied: No token provided" });
    }

    const bearerToken = bearerHeader.split(" ")[1];

    if (!bearerToken) {
      return res
        .status(401)
        .json({ message: "Access denied: Invalid token format" });
    }

    const authData = await new Promise((resolve, reject) => {
      jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    return res.status(200).json({ message: "Access granted!", authData });
  } catch (error) {
    return res.status(403).json({ message: "Access denied: Invalid token" });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader === "undefined") {
      return res
        .status(401)
        .json({ message: "Access denied: No token provided" });
    }

    const bearerToken = bearerHeader.split(" ")[1];

    if (!bearerToken) {
      return res
        .status(401)
        .json({ message: "Access denied: Invalid token format" });
    }

    const authData = await new Promise((resolve, reject) => {
      jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    req.user = authData.user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Access denied: Invalid token" });
  }
};

/**
 * General function to check if user has the required role
 */
const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    const currentUser = req.user; // Better naming

    User.findOne({ where: { id: currentUser.id } })
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(401).send({ message: "Forbidden" });
        }
        if (requiredRoles.includes(dbUser.role)) {
          next();
        } else {
          res
            .status(403)
            .send({ message: "You are Not Authorized to Perform This Action" });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Internal Server Error" });
      });
  };
};

// ✅ Middleware functions for different role-based access
exports.withSuperAdmin = checkRole(["ROLE_SUPER_ADMIN"]);
exports.withSystemAdmin = checkRole(["ROLE_SYSTEM_ADMIN"]);
exports.withAdmin = checkRole(["ROLE_ADMIN"]);
exports.withHOD = checkRole(["ROLE_HOD"]);
exports.withFaculty = checkRole(["ROLE_FACULTY"]);

// ✅ Middleware for combined roles
exports.withAdminOrHOD = checkRole(["ROLE_ADMIN", "ROLE_HOD"]);
exports.withAdminOrSystemAdmin = checkRole(["ROLE_ADMIN", "ROLE_SYSTEM_ADMIN"]);
exports.withHigherRoles = checkRole([
  "ROLE_SUPER_ADMIN",
  "ROLE_SYSTEM_ADMIN",
  "ROLE_ADMIN",
  "ROLE_HOD",
]); // High-level access
exports.withSuperAdminOrAdmin = checkRole(["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]);

exports.withAdminOrSelf = (req, res, next) => {
  if (req.user.role === "ROLE_ADMIN" || req.user.id === req.params.id) {
    return next(); // Allow access
  }
  return res.status(403).json({ message: "Access denied" });

  if (
    req.user.role === "ROLE_ADMIN" ||
    String(req.user.id) === String(req.params.id)
  ) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

exports.withAuth = checkRole;
