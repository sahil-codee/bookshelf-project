// routes.js
import express from "express";
import authenticateMiddleware from "../Middleware/middleware.js";
import * as UserController from "../Controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Server is up and running.");
});

router.post("/login", UserController.login);
router.post("/signup", UserController.signup);
router.get("/verify-token", authenticateMiddleware, UserController.verifyToken);
router.post(
  "/dashboard/update-rating",
  authenticateMiddleware,
  UserController.updateBookRating
);
router.post(
  "/dashboard",
  authenticateMiddleware,
  UserController.addToDashboard
);
router.get("/dashboard", authenticateMiddleware, UserController.getDashboard);
router.post(
  "/dashboard/remove-book",
  authenticateMiddleware,
  UserController.removeBook
);

export default router;
