const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
  beforeEach(done => {
    this.wiki;
    this.user;
    sequelize.sync({ force: true }).then((res) => {
      User.create({
        name: "Test User",
        email: "testuser@test.com",
        password: "password123"
      })
        .then(user => {
          this.user = user; 
          Wiki.create({
            title: "React Tips",
            body: "Single page applications, galore!",
            userId: this.user.id      
            })
            .then((wiki) => {
              this.wiki = wiki; 
              done();
            });
        });
    });
  });

  describe("#create()", () => {
    it("should create a wiki object with a title and body", done => {
      Wiki.create({
        title: "Learning Node.js",
        body: "It runs on the server!",
        userId: this.user.id
      })
        .then( wiki => {
          expect(wiki.title).toBe("Learning Node.js");
          expect(wiki.body).toBe("It runs on the server!");
          expect(wiki.private).toBe(false);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it("should not create a wiki with a missing title or body", done => {
      Wiki.create({
        title: "Learning Node.js"
      })
        .then( wiki => {
          done();
        })
        .catch( err => {
          expect(err.message).toContain("Wiki.body cannot be null");
          done();
        });
    });
  });

  describe("#setUser()", () => {
    it("should associate a wiki and a user together", done => {
      User.create({
        name: "Ada Jones",
        email: "ada@example.com",
        password: "password"
      })
      .then( newUser => {
        expect(this.wiki.userId).toBe(this.wiki.id);
        this.wiki.setUser(newUser)
        .then( wiki => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });
  describe("#getUser()", () => {
    it("should return the associated wiki", done => {
      this.wiki.getUser()
      .then( associatedUser => {
        expect(associatedUser.email).toBe("testuser@test.com");
        done();
      });
    });
  });
}); 