var express = require('express');
var router = express.Router();

const withAuth = require("../withAuth")

const expense = require("../controllers/expense.controller.js");

// 📌 Create a new Expense (Only Admin & System Admin)
router.post('/', withAuth.verifyToken, withAuth.withHigherRoles, expense.create);

// 📌 Retrieve all Expenses (Only Admin & System Admin)
router.get('/', withAuth.verifyToken, withAuth.withHigherRoles, expense.findAll);

router.get('/college', withAuth.verifyToken, withAuth.withAdmin, expense.getCollegeExpenses);

// 📌 Retrieve Expenses By Year (Only Admin & System Admin)
router.get('/year/:id', withAuth.verifyToken, withAuth.withHigherRoles, expense.findAllByYear);

// 📌 Retrieve Expenses By Year and Department (Admin, System Admin, HOD)
router.get('/year/:id/department/:id2', withAuth.verifyToken, withAuth.withHigherRoles, expense.findAllByYearAndDept);

// 📌 Retrieve all Expenses by Department Id (Admin, System Admin, HOD)
router.get('/department/:id', withAuth.verifyToken, withAuth.   withHigherRoles, expense.findAllByDeptId);

// 📌 Retrieve a single Expense by ID (Admin, System Admin, HOD)
router.get('/:id', withAuth.verifyToken, withAuth.withHigherRoles, expense.findOne);

// 📌 Update an Expense (Only Admin & System Admin)
router.put('/:id', withAuth.verifyToken, withAuth.withHigherRoles, expense.update);

// 📌 Delete all Expenses (Only Super Admin)
router.delete('/', withAuth.verifyToken, withAuth.withSuperAdmin, expense.deleteAll);

// 📌 Delete an Expense by ID (Only Super Admin & Admin)
router.delete('/:id', withAuth.verifyToken, withAuth.withHigherRoles, expense.delete);

// 📌 Delete all Expenses by Department ID (Only Super Admin & Admin)
router.delete('/department/:id', withAuth.verifyToken, withAuth.withHigherRoles, expense.deleteAllByDeptId);

module.exports = router;
