const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },
  create(req, res, next) {
    
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.password_conf
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        console.log(err);
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  },
  signInForm(req, res, next) {
    res.render("users/sign_in");
  },
  signIn(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        req.flash("notice", "Sign in failed. Please try again.");
        return res.redirect("/users/sign_in");
      } else {
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          req.flash("notice", "You've successfully signed in!");
          return res.redirect("/");
        });
      }
    })(req, res, next);
  },
  signOut(req, res, next) {
    req.logOut();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  premiumCheckout(req, res, next) {
    res.render("users/upgrade");
  },
  upgrade(req, res, next) {
    const addSubscription = (stripeId, userId) => {
      stripe.subscriptions.create({
        customer: stripeId,
        items: [{plan: "plan_E6IHEjUt4lGh1x"}]
      })
      .then( subscription => {
        userQueries.changePremiumStatus(userId, stripeId, true, (err, user) => {
          if (err) {
            req.flash("notice", err);
            res.redirect("/users/upgrade");
          } else {
            req.flash("notice", "You've successfully upgraded to a Premium account!");
            res.redirect("/");
          }
        });
      })
      .catch( err => {
        req.flash("notice", `Subscription ${err}`);
        res.redirect("/users/upgrade");
      })
    }

    if (req.body.stripeToken) {
      const token = req.body.stripeToken;
      if (!req.user.stripeId) {
        stripe.customers.create({
          email: req.user.email,
          source: token
        })
        .then( customer => {
          addSubscription(customer.id, req.user.id);
        })
        .catch( err => {
          req.flash("notice", `User ${err}`);
          res.redirect("/users/upgrade");
        })
      } else {
        addSubscription(req.user.stripeId, req.user.id);
      }
    }
  },
  confirmDowngrade(req, res, next) {
    res.render("users/downgrade");
  },
  downgrade(req, res, next) {
    stripe.customers.retrieve(req.user.stripeId)
    .then( customer => {
      stripe.subscriptions.del(customer.subscriptions.data[0].id)
      .then( subscription => {
        userQueries.changePremiumStatus(req.user.id, req.user.stripeId, false, (err, user) => {
          if (err) {
            req.flash("notice", err);
            res.redirect("/users/upgrade");
          } else {
            req.flash("notice", "\nYou've successfully downgraded to a Standard account!");
            res.redirect("/");
          }
        });
      })
    })
    .catch( err => {
      req.flash("notice", err);
      next();
    })
  }
}