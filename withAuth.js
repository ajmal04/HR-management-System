const jwt = require('jsonwebtoken');
const db = require("./models");
const User = db.user;

/**
 * Middleware to verify JWT token
 */
exports.checkToken = (req, res) => {
    //Get auth header value
    const bearerHeader = req.headers['authorization']; 
    
    //Check if undefined
    if(typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ');
        
        //Get token from array
        const bearerToken = bearer[1];

        //Set the token
        req.token = bearerToken;

        jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
            if(err) {
                res.status(403).send({message: 'Access denied: Wrong access token'});
            } else {
                res.status(201).send({message: 'Access granted!', authData});
            }
        })
    } else {
        res.status(401).send({message: 'Access denied: No token provided'});
    }
}

exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']; 

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];

        jwt.verify(bearerToken, process.env.SECRET_KEY, (err, authData) => {
            if (err) {
                return res.status(403).send({ message: 'Access denied: Invalid token' });
            } 
            
            req.user = authData.user;  // ✅ Attach user info to request
            next();
        });
    } else {
        return res.status(401).send({ message: 'Access denied: No token provided' });
    }
};

/**
 * General function to check if user has the required role
 */
const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        const currentUser = req.user;  // Better naming

        User.findOne({ where: { id: currentUser.id } })
            .then(dbUser => {
                if (!dbUser) {
                    return res.status(401).send({ message: "Forbidden" });
                }
                if (requiredRoles.includes(dbUser.role)) {
                    next();
                } else {
                    res.status(403).send({ message: "You are Not Authorized to Perform This Action" });
                }
            })
            .catch(err => {
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
exports.withHigherRoles = checkRole(["ROLE_SUPER_ADMIN", "ROLE_SYSTEM_ADMIN", "ROLE_ADMIN","ROLE_HOD"]);  // High-level access
exports.withSuperAdminOrAdmin = checkRole(["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]); 


exports.withAdminOrSelf = (req, res, next) => {
    if (req.user.role === "ROLE_ADMIN" || req.user.id === req.params.id) {
        return next();  // Allow access
    }
    return res.status(403).json({ message: "Access denied" });
};
