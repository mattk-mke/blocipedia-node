const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(isPremium, callback) {
    return Wiki.all(
      isPremium ? {} : {
      where: {
        private: false
      }
    })
    .then( wikis => {
      callback(null, wikis);
    })
    .catch( err => {
      callback(err);
    });
  },
  addWiki(newWiki, callback) {
    return Wiki.create(newWiki)
    .then( wiki => {
      callback(null, wiki);
    })
    .catch( err => {
      callback(err);
    });
  },
  getWiki(id, callback) {
    return Wiki.findById(id)
    .then( wiki => {
      callback(null, wiki);
    })
    .catch( err => {
      callback(err);
    });
  },
  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id)
    .then( wiki => {
      const authorized = new Authorizer(req.user, wiki).destroy();
      if (authorized) {
        wiki.destroy()
        .then( res => {
          callback(null, wiki);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch( err => {
      callback(err);
    });
  },
  updateWiki(req, updatedWiki, callback) {
    return Wiki.findById(req.params.id)
    .then( wiki => {
      if (!wiki) {
        console.log("Wiki not found!")
        return callback("Wiki not found");
      }
      const authorized = new Authorizer(req.user, wiki).update();
      if (authorized) {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then( () => {
          callback(null, wiki);
        })
        .catch( err => {
          callback(err);
        });
      }
    });
  },
  publicizeUserWikis(id, callback) {
    return Wiki.update({ private: false }, {
      where: {
        userId: id,
        private: true
      }
    })
    .then( wikisCount => {
      console.log(wikisCount);
      callback(null, wikisCount[0]);
    })
    .catch( err => {
      console.log(err);
      callback(err);
    });
  }
}