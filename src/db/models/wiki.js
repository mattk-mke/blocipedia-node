'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Wiki.belongsToMany(models.User, {
      as: "Collaborators",
      through: "collaborations",
      foreignKey: "wikiId",
      otherKey: "userId"
    });
    
  };

  Wiki.prototype.isCollaborator = function(userId) {
    return this.getCollaborators()
    .then( collaborators => {
      collaborators.forEach( collaborator => {
        if (collaborator.id == userId) {
          return true;
        }
      });
      return false;
    })
    .catch(err => {
      console.log(err);
      return false;
    });
  };

  return Wiki;
};