import { Request, Response, NextFunction } from "express";
import {
    verifyAccessToken,
    AccessTokenPayload
} from "../../modules/identity/lib/jwt";

declare global {
    namespace Express {
        interface Request {
            auth?: AccessTokenPayload & { sub: string }
        }
    }
}

export async function verifyJwt(
    req: Request, 
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "UNAUTHORIZED",
            message: "Missing or invalid token",
        });
    }

    const token = header.slice(7);
    try {
        req.auth = await verifyAccessToken(token);
        next();
    } catch {
        return res.status(401).json({
            error: "UNAUTHORIZED",
            message: "Invalid or expired token",
        });
    }
}