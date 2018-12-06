const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists."
      },
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    },
    stripeId: {
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here

    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

    User.afterCreate( (user, callback) => {
      if (process.env.NODE_ENV === "test") {
        return console.log("Emails not sent during tests");
      }
      const msg = {
        to: user.email,
        from: "noreply@blocipedia.org",
        subject: "Welcome to Blocipedia!",
        text: `Hello, ${user.name}.\n\nThanks for signing up!`
      };
      return sgMail.send(msg);
    });
  };

  User.prototype.isAdmin = function () {
    return this.role == "admin";
  };

  User.prototype.isPremium = function () {
    return this.role == "admin" || this.role == "premium";
  };
  
  return User;
};