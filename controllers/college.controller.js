const db = require("../models");
const Department = db.department; // Import the Department model
const User = db.user;
const UserPersonalInfo = db.userPersonalInfo
const Job = db.job
const { Op } = require("sequelize"); 

exports.getColleges = (req, res) => {
    const colleges = Department.rawAttributes.college.values; // Read ENUM values

    if (!colleges || colleges.length === 0) {
        return res.status(404).send({ message: "No colleges found." });
    }

    res.status(200).send(colleges);
};

exports.getUsersFromSameCollege = async (req, res) => {
    try {
        const currentUser = req.user;
        
        if (currentUser.role !== 'ROLE_ADMIN') {
            return res.status(403).send({ message: "Access denied. Only admins allowed." });
        }

        const users = await User.findAll({
            where: {
                college: currentUser.college,
                role: ['ROLE_FACULTY', 'ROLE_HOD'],
                id: { [Op.ne]: currentUser.id }
            },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Department,
                    attributes: ['department_name']
                },
                {
                    model: UserPersonalInfo,
                    attributes: ['mobile'] // Only load mobile if that's all you need
                },
                {
                    model: Job,
                    where: {
                        // Optional: filter for current jobs only
                        startDate: { [Op.lte]: new Date() },
                        endDate: { [Op.gte]: new Date() }
                    },
                    required: false // Make this optional
                }
            ]
        });

        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};