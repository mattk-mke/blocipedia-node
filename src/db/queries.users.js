const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then( user => {
      callback(null, user);
    })
    .catch( err => {
      callback(err);
    });
  },
  changePremiumStatus(id, stripeId, premium, callback) {
    const status = premium ? "premium" : "standard";
    User.findById(id)
    .then( user => {
      if (!user) {
        return callback("User not found.")
      }
      user.update({role: status, stripeId: stripeId})
      .then( user => {
        callback(null, user);
      })
      .catch( err => {
        callback(err);
      })
    })
  },
  getAllUsers(callback) {
    User.all()
    .then( users => {
      callback(null, users)
    })
    .catch( err => {
      callback(err);
    })
  },
  getAllPrivateWikis(user, callback) {
    user.getPrivateWikis()
    .then( privateWikis => {
      callback(null, privateWikis);
    })
    .catch( err => {
      callback(err)
    });
  }
}