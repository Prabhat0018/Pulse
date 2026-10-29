import { Request, Response } from "express";
import { registerUser } from "../services/authservice";
import { loginUser } from "../services/authservice";
import jwt from "jsonwebtoken";

export const loginController = async (
    req: Request,
    res: Response
) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        const user = await loginUser(email, password);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login successful",
            user,
            token
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const registerController = async (
    req: Request,
    res: Response
) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    try {
        const user = await registerUser(name, email, password);

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error: any) {
    if (error.code === "23505") {
        return res.status(409).json({
            message: "Email already registered"
        });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
        message: "Internal server error"
    });
}
};