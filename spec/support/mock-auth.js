module.exports = {
  fakeIt(app) {
    let name, role, id, email;
    const middleware = (req, res, next) => {
      name = req.body.name || name;
      role = req.body.role || role;
      id = req.body.userId || id;
      email = req.body.email || email;
      if (id && id != 0) {
        req.user = {
          "name": name,
          "id": id,
          "email": email,
          "role": role
        };
      } else if (id == 0) {
        delete req.user;
      }
      if (next) { next() }
    }
    const route = (req, res) => {
      res.redirect("/");
    }
    app.use(middleware);
    app.get("/auth/fake", route)
  }
}