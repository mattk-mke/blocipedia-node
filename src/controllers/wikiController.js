const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;

module.exports = {
  index(req, res, next) {
    let isPremium;
    if(req.user) {
      isPremium = req.user.isPremium();
    } else {
      isPremium = false;
    }
    wikiQueries.getAllWikis(isPremium, (err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", {wikis});
      }
    });
  },
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis/");
    }
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if (authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.user.isPremium() ? req.body.privacy == "true" : false,
        userId: req.user.id
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis/");
    }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if ( err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).show();
        if (authorized) {
          let htmlView = markdown.toHTML(wiki.body);
          res.render("wikis/show", {wiki, htmlView});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/`);
        }
      }
    });
  },
  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if (err) {
        res.redirect(err, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, "/wikis/");
      }
    });
  },
  edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/wikis/");
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();
        if (authorized) {
          res.render("wikis/edit", {wiki});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },
  update(req, res, next) {
    let updatedWiki = {
      title: req.body.title,
      body: req.body.body,
      private: req.user.isPremium() ? req.body.privacy == "true" : false,
      userId: req.user.id
    };
    wikiQueries.updateWiki(req, updatedWiki, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`)
      }
    });
  },
  publicize(req, res, next) {
    wikiQueries.publicizeUserWikis(req.user.id, (err, wikiCount) => {
      if (err) {
        req.flash("notice", `${err} . No wikis have been made public`)
        res.redirect(404, "/");
      } else {
        req.flash("notice", `${wikiCount} wiki(s) have been made public. `);
        next();
      }
    })
  },
  
}