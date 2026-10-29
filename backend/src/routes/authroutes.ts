import { Router } from "express";
import { registerController } from "../controllers/authcontroller";
import { loginController } from "../controllers/authcontroller";

const router = Router();

router.post("/auth/login", loginController);

router.post("/auth/register", registerController);

export default router;