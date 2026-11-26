import {
  userSignup,
  userLogin,
  allUsers,
  deleteUser,
  adminLogin,
  adminSignup,
  getProfie,
  userLogout,
  adminLogout,
  editUser,
} from "../controller/userController.js";

import AdminAuthMiddleware from "../middlewares/adminMiddleware.js";
import Authmiddleware from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

// Public routes
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", userLogout);

// Protected user routes
router.get("/profile", Authmiddleware, getProfie);
router.patch("/profile/edit", Authmiddleware, editUser);

// Admin authentication
router.post("/adminlogin", adminLogin);
router.post("/adminlogout", adminLogout);

// Protected admin routes
router.post("/adminsignup", AdminAuthMiddleware, adminSignup);
router.get("/allusers", AdminAuthMiddleware, allUsers);
router.delete("/:id", AdminAuthMiddleware, deleteUser);

router.get("/admin/me", AdminAuthMiddleware, (req, res) => {
  return res.status(200).json({
    authenticated: true,
    user: req.user,
  });
});

export default router;
