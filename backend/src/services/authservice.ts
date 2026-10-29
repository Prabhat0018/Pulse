import pool from "../db";
import bcrypt from "bcrypt";

export const registerUser = async (
    name: string,
    email: string,
    password: string
) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [name, email, passwordHash]
    );

    return result.rows[0];
};

export const loginUser = async (
    email: string,
    password: string
) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
};