const express = require("express");
const router = express.Router();

//Controller
const {register, login, getCurrentUser, update, getUserById} = require("../controllers/UserController/UserController");

//Middlewares
const validate = require("../middlewares/handleValidation");
const { userCreateValitation, loginValidation, userUpdateValidation,} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

//Routes
router.post("/register", userCreateValitation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put("/", authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"),update);
router.get("/:id", getUserById);



module.exports = router;
