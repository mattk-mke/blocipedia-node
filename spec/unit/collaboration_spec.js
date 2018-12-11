const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Collaboration", () =>{
  beforeEach( done => {
    sequelize.sync({force: true})
    .then( () => {
      this.user;
      this.wiki;
  
      User.create({
        name: "User Smith",
        email: "user@example.com",
        password: "1234567890",
        role: "premium"
      })
      .then((user) => {
        this.user = user;
        Wiki.create({
          title: "Learning Node.js",
          body: "It runs on the server!",
          userId: this.user.id,
          private: true
        })
        .then( wiki => {
          this.wiki = wiki;
          done();
        })
        .catch( err => {
          console.log(err);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    })
    .catch( err => {
      console.log(err);
      done();
    });

  });

  describe("#addCollaborator()", () => {
    it("should add a collaborator to the wiki", done => {
      this.wiki.addCollaborator(this.user)
      .then( collaborations => {
        expect(collaborations[0][0].userId).toBe(1);
        expect(collaborations[0][0].wikiId).toBe(1);
        done();
      })
      .catch( err => {
        expect(err).toBeNull();
        console.log(err);
        done();
      });
    });
  });

  describe("#getCollaborators()", () => {
    it("should retrieve all collaborators from a wiki", done => {
      this.wiki.addCollaborator(this.user)
      .then( collaborations => {
        this.wiki.getCollaborators()
        .then( users => {
          expect(users[0].name).toBe("User Smith");
          done();
        })
        .catch( err => {
          expect(err).toBeNull();
          console.log(err);
          done();
        });
      })
      .catch( err => {
        expect(err).toBeNull();
        console.log(err);
        done();
      });
    });
  });
});