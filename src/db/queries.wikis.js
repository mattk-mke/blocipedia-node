const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(user, callback) {
    return Wiki.all({
      where: {
        private: false
      }
    })
    .then( wikis => {
      if (user) {
        if(user.isAdmin()) {
          Wiki.all({
            where: {
              private: true
            }
          })
          .then( privateWikis =>{
            callback(null, wikis, privateWikis);
          })
          .catch( err => {
            callback(err);
          });
        } else {
          user.getPrivateWikis()
          .then( privateWikis => {
            if (privateWikis.length == 0) {
              callback(null, wikis, null);
            } else {
              callback(null, wikis, privateWikis);
            }
          })
          .catch( err => {
            callback(err);
          })
        }
      } else {
        callback(null, wikis, null);
      }
    })
    .catch( err => {
      callback(err);
    });
  },
  addWiki(newWiki, callback) {
    return Wiki.create(newWiki)
    .then( wiki => {
      wiki.setCollaborators(wiki.private ? [wiki.userId] : null)
      .then( collaborators => {
        callback(null, wiki);
      })
      .catch( err => {
        callback(err);
      });
    })
    .catch( err => {
      console.log(err);
      callback(err);
    });
  },
  getWiki(id, callback) {
    return Wiki.findById(id)
    .then( wiki => {
      wiki.getCollaborators()
      .then( collaborators => {
        callback(null, wiki, collaborators);
      })
      .catch( err => {
        callback(err);
      });
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
        return callback("Wiki not found");
      }
      const authorized = new Authorizer(req.user, wiki).update();
      if (authorized) {
        
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then( () => {
          wiki.setCollaborators(req.body.collaborators ? req.body.collaborators : (wiki.private ? req.user.id : null))
          .then( () => {
            callback(null, wiki);
          })
          .catch( err => {
            console.log(err);
            callback(err);
          });
        })
      }
    });
  },
  publicizeUserWikis(id, callback) {
    return Wiki.update({ private: false, collaborators: null}, {
      where: {
        userId: id,
        private: true
      }
    })
    .then( wikisCount => {
      callback(null, wikisCount[0]);
    })
    .catch( err => {
      console.log(err);
      callback(err);
    });
  }
}