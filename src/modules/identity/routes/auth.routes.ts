import { Router } from "express";

import { loginUser, registerUser } from "../services/auth.service";
import { verifyJwt } from "../../../shared/middleware/verifyJwt";
import { User } from "../models/User";

const router = Router();

router.post("/register", async(req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ error: "BAD_REQUEST", message: "Email and password required" });
        }
        const user = await registerUser(email, password);
        return res.status(201).json(user);
    } catch(e: unknown) {
        const err = e as Error & { status?: number };
        return res.status(err.status ?? 500).json({
            error: err.status === 409 ? "CONFLICT" : "INTERNAL ERROR",
            message: err.message
        })
    }
})

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                error: "BAD_REQUEST",
                message: "Email and password required"
            })
        }
        const tokens = await loginUser(email, password);
        return res.status(200).json(tokens)
    } catch(e: unknown) {
        const err = e as Error & { status?: number }
        return res.status(err.status ?? 500).json({
            error: err.status === 401 ? "UNAUTHORIZED" : "INTERNAL_ERROR",
            message: err.message
        })
    }
})

router.get("/me", verifyJwt, async(req, res) => {
    const user = await User.findById(req.auth!.sub).select(
        "-passwordHash -refreshTokenHash"
    )
    if(!user) {
        return res.status(404).json({
            error: "NOT_FOUND",
            message: "User not found"
        })
    }
    return res.json(user)
})

export default router;
