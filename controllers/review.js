const Review =  require("../models/review");
const Campground = require("../models/campground")
module.exports.createReview = async (req,res)=>{
    console.log(req.body);
     const campReview = await Campground.findById(req.params.id)
     const review = new Review(req.body.review)
     review.author = req.user._id;
     campReview.reviews.push(review);
     await review.save()
     await campReview.save()
     req.flash("success","Created a new review!")
     res.redirect(`/campgrounds/${campReview._id}`)
};
module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Successfully deleted review")
    res.redirect(`/campgrounds/${id}`) 
}