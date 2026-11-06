import pool from "../db";

export const createNotification = async (
    recipientId: number,
    actorId: number,
    type: "like" | "comment",
    postId: number,
    commentId?: number
) => {
    if (recipientId === actorId) {
        return null;
    }

    const result = await pool.query(
        `INSERT INTO notifications
         (recipient_id, actor_id, type, post_id, comment_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [recipientId, actorId, type, postId, commentId ?? null]
    );

    return result.rows[0];
};

export const getNotifications = async (userId: number) => {
    const result = await pool.query(
        `SELECT
            n.id,
            n.type,
            n.post_id,
            n.comment_id,
            n.is_read,
            n.created_at,
            u.name AS actor_name
         FROM notifications n
         JOIN users u ON n.actor_id = u.id
         WHERE n.recipient_id = $1
         ORDER BY n.created_at DESC`,
        [userId]
    );

    return result.rows;
};
