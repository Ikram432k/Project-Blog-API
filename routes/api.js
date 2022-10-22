var express = require('express');
var router = express.Router();
const User = require("../controllers/userController")

/* GET home page. */
// create author - api/signup
router.post("/sign-up", User.signIn);

module.exports = router;
