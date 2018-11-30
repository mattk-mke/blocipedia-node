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
      defaultValue: "member"
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.afterCreate( (user, callback) => {
      const msg = {
        to: user.email,
        from: "noreply@blocipedia.org",
        subject: "Welcome to Blocipedia!",
        text: `Hello, ${user.name}.\n\nThanks for signing up!`
      };
      return sgMail.send(msg);
    });
  };
  return User;
};