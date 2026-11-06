import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

import {
    getNotificationsController,
    markNotificationReadController
} from "../controllers/notificationcontroller";

const router = Router();

router.get(
    "/notifications",
    authMiddleware,
    getNotificationsController
);

router.patch(
    "/notifications/:id/read",
    authMiddleware,
    markNotificationReadController
);

export default router;