import bcrypt from "bcrypt";
import crypto from "crypto";

import { signAccessToken, signRefreshToken } from "../lib/jwt";
import { User, UserType } from "../models/User";
import { Role } from "../models/Role";

const SALT_ROUNDS = 12;

export async function registerUser(email: string, password: string) {
    const existing = await User.findOne({ email });
    if(existing) {
        const err = new Error("Email already registered") as Error & { status: number };
        err.status = 409;
        throw err;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        email,
        passwordHash,
        userType: "general",
        roles: []
    });

    return { id: user._id, email: user.email, userType: user.userType };
}

function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if(!user) {
        const err = new Error("Invalid credentials") as Error & { status: number }
        err.status = 401
        throw err
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) {
        const err = new Error("Invalid credentials") as Error & { status: number }
        err.status = 401
        throw err
    }

    const roleDocs = await Role.find({ name: { $in: [...user.roles] } });
    const permissions = [
        ...new Set(roleDocs.flatMap((role) => [...role.permissions])),
    ];

    const accessToken = await signAccessToken({
        sub: user._id.toString(),
        email: user.email,
        userType: user.userType,
        roles: [...user.roles],
        permissions
    })

    const refreshToken = await signRefreshToken(user._id.toString())
    user.refreshTokenHash = hashToken(refreshToken)
    await user.save()

    return { accessToken, refreshToken }
}
