import { Request, Response } from "express";
import pool from "../db";
import { getNotifications } from "../services/notificationservice";

export const getNotificationsController = async (
    req: Request,
    res: Response
) => {
    try {
        const notifications = await getNotifications(
            req.user!.userId
        );

        return res.json({ notifications });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch notifications"
        });
    }
};

export const markNotificationReadController = async (
    req: Request,
    res: Response
) => {
    const notificationId = Number(req.params.id);

    if (!Number.isInteger(notificationId) || notificationId <= 0) {
        return res.status(400).json({
            message: "Invalid notification ID"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE id = $1 AND recipient_id = $2
             RETURNING *`,
            [notificationId, req.user!.userId]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        return res.json({
            message: "Notification marked as read",
            notification: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to update notification"
        });
    }
};