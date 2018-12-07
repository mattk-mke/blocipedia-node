const express = require("express");
const router = express.Router();
const validation = require("./validation");
const helper = require("../auth/helpers");

const userController = require("../controllers/userController")
const wikiController = require("../controllers/wikiController")

router.get("/users/sign_up", userController.signUp);
router.post("/users/sign_up", 
  validation.validateUsers, 
  userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/upgrade", 
  helper.ensureAuthenticated,
  userController.premiumCheckout);
router.post("/users/upgrade", userController.upgrade);
router.get("/users/downgrade",
  helper.ensureAuthenticated,
  userController.confirmDowngrade);
router.post("/users/downgrade",
  wikiController.publicize,
  userController.downgrade);

module.exports = router;