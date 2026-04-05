const express = require("express");
const router = express.Router();

const {storeReturnTo} = require("../middleware");
const passport = require('passport');
const catchAsync = require("../utils/catchAsync")
const Users = require("../controllers/user");
router.route("/register")
    .get( Users.viewRegister )
    .post( catchAsync(Users.registerUser));

router.route("/login")
    .get( Users.viewLogin)
    .post( storeReturnTo,
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }),
   Users.loginUser
);
router.post("/logout", Users.logoutUser)
module.exports = router;
