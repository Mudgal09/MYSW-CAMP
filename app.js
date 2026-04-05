if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}




// **EXPRESS
const express= require ('express');
const app = express();

// ** EJS PATH
const path = require ('path');
// **EXPRESS-SESSION
const session =  require('express-session')
// MONGOOSE 
const mongoose = require('mongoose');
// HELMET
const helmet = require("helmet")
// MODELS
const Campground = require('./models/campground');
const Review = require('./models/review')
const User = require("./models/user")
// PASSPORT 
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
// JOI SCHEMA
const Joi = require('joi')
// CONNECT FLASH
const flash = require("connect-flash");
// ROUTER
const userRoutes = require("./router/loguse")
const seprouter = require('./router/seprouter')
const sepreviewer = require('./router/sepreview')
// ERROR SYNC
const catchAsync = require('./utils/catchAsync')
const AppErr = require('./errSync')
const {errorSchema, reviewSchema} = require('./errSch')
const ejsMate = require('ejs-mate')
// OVERRIDE METHOD
const methodOverride = require('method-override');
// CONNECT-MONGO
const mongoSanitize = require('express-mongo-sanitize');
// CLOUDINARY
const multer = require("multer");
const {storage} = require("./cloudinary");
const upload = multer({storage})

const campground = require('./models/campground');
const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
     if (error) {
        const msg = error.details.map(el => el.message);
        throw new AppErr(msg.join(","),400)
    }
   next()
}
const MongoDBStore = require("connect-mongo").default;

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mysw-camp';

mongoose.connect(dbUrl);
// app.use(mongoSanitize())
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoDBStore.create({
    mongoUrl : dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
    store:store,
    name:"session",
    secret: "thisshouldbeabettersecret",
    resave:false,
    saveUninitialized: false,
    cookie : {
        httpOnly : true,
        secure:false,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}



app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,"public")))

app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc: ["'self'",...connectSrcUrls],
            scriptSrc : ["'unsafe-inline'","'self'",...scriptSrcUrls],
            styleSrc : ["'self'","'unsafe-inline'",...styleSrcUrls],
            workerSrc : ["'self'","blob:"],
            objectSrc : [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/",
                "https://images.unsplash.com/",
                "https://api.maptiler.com/"
            ],
            fontSrc : ["'self'",...fontSrcUrls]
        }
    })
)

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    next();
})
app.use('/campgrounds',seprouter)
app.use('/campgrounds/:id/reviews',sepreviewer)
app.use('/',userRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})






const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection.error:"));
db.once("open",()=>{
    console.log("Database Connected");
})




app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',ejsMate)




app.get('/makecamp',async(req,res)=>{
    const camp = new Campground({title:"My Backyard",description:"cheap camping"})
    await camp.save();
    res.send(camp)
})
// MAIN ROUTE


app.use((req,res,next)=>{
    next(new AppErr('Page not found',404))
})
app.use((err,req,res,next)=> {
    const {status = 500} = err
    if(!err.message) err.message = "Oh no something went wrong!!!"
    res.status(status).render('error',{err})
})



// LAST CALL
app.listen(3000,()=>{
    console.log("Serving on port 3000")
})