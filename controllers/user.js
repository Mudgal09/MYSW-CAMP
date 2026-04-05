const User = require("../models/user");
const flash = require("connect-flash")
module.exports.viewRegister = async (req, res) => {
    res.render('users/register')
}
module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to MYSW CAMP");
            res.redirect("/campgrounds")
        })
  
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect('register')
    }
}
module.exports.viewLogin = (req, res) => {
    res.render("users/login")
}
module.exports.loginUser = (req, res, next) => {
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;

    req.flash("success", "Welcome Back!");

    req.session.save(err => {
        if (err) return next(err);
        res.redirect(redirectUrl);
    });
};
    module.exports.logoutUser = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err)
        }
        req.flash("success", "GoodBye");
       req.session.save(() => {
         res.redirect("/campgrounds")
       })
    })
}