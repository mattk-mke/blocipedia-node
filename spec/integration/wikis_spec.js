const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        name: "Wiki Man",
        email: "wikiman@example.com",
        password: "Wikkitywikkity"
      })
      .then((user) => {
        this.user = user;
        Wiki.create({
          title: "Learning Node.js",
          body: "It runs on the server!",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        });
      });
    });
  });

  // Standard user context
  describe("standard user performing CRUD actions for wikis", () => {
    beforeEach( done => {
      User.create({
        name: "Member User",
        email: "member@example.com",
        password: "123456",
        role: "member"
      })
      .then( user => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            name: user.name,
            role: user.role,
            userId: user.id,
            email: user.email
          }
        }, (err, res, body) => {
          done();
        });
      });
    });

    describe("GET /wiki/new", () => {
      it("should render a new wiki form", done => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });

    describe("POST /wiki/create", () => {
      it("should create a new wiki and redirect", done => {
        const options = {
          url: `${base}create`,
          form: {
            title: "React Tips",
            body: "Single page applications, galore!",
            private: false
          }
        };
        request.post(options, (req, res, body) => {
          Wiki.findOne({where: {title: "React Tips"}})
          .then( wiki => {
            expect(wiki).not.toBeNull();
            expect(wiki.title).toBe("React Tips");
            expect(wiki.body).toBe("Single page applications, galore!");
            done();
          })
          .catch( err => {
            console.log(err);
            done();
          });
        });
      });
      it("should not create a new wiki that fails validations", done => {
        const options = {
          url: `${base}create`,
          form: {
            title: "a",
            body: "b"
          }
        };
        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "a"}})
          .then( wiki => {
            expect(wiki).toBeNull();
            done();
          })
          .catch( err => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /wiki/:id", () => {
      it("should render a view with the selected wiki", done => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("It runs on the server!");
          done();
        });
      });
    });

    describe("POST /wiki/:id/destroy", () => {
      it("should delete a wiki with the specified id", done => {
        Wiki.all()
        .then( wikis => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all()
            .then( wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /wiki/:id/edit", () => {
      it("should render a view with an edit wiki form", done => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("It runs on the server!");
          done();
        });
      });
    });

    describe("POST /wiki/:id/update", () => {
      it("should update the wiki with the given values", done => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Learning Node.js",
            body: "Modules are key!",
            private: false
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: {id: this.wiki.id}
          })
          .then( wiki => {
            expect(wiki.body).toBe("Modules are key!");
            done();
          });
        });
      });
    });
  });
});
