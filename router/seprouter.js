const express= require ('express');

const router = express.Router({mergeParams:true});
const Joi = require('joi')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require("../middleware")
const Campgrounds = require("../controllers/campground")
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage})


router.route("/")
    .get (catchAsync(Campgrounds.index))
    .post(isLoggedIn,upload.array("image"),validateCampground,catchAsync(Campgrounds.createNewCampground));

router.get('/new', isLoggedIn, Campgrounds.renderNewForm)

router.route("/:id")
    .get ( catchAsync(Campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array("image"),validateCampground,catchAsync(Campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(Campgrounds.deleteCampground))

// EDIT ROUTE
router.get ('/:id/edit',isLoggedIn, isAuthor, catchAsync(Campgrounds.renderUpdateForm));


module.exports = router;
