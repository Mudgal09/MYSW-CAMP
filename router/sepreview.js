const express= require('express');
const router = express.Router({mergeParams : true});
const Joi = require('joi')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const Review = require('../models/review')
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware")
const Reviews = require("../controllers/review")
// REVIEW ROUTE
router.post("/", isLoggedIn,validateReview, catchAsync (Reviews.createReview))
// DELETE AND ERROR ROUTES

router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync(Reviews.deleteReview))

module.exports = router;

