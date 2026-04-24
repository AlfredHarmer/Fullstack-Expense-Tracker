
const express = require('express');
const router = express.Router();

console.log("AUTH ROUTES LOADED");

const controller = require('../controllers/authController');

console.log("CONTROLLER:", controller);
console.log("REGISTER TYPE:", typeof controller.register);

//register user
router.post('/register', controller.register);

//login user
router.post('/login', controller.login);

module.exports = router;
