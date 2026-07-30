import { Request, Response, NextFunction } from "express";

export function requirePermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const permissions = req.auth?.permissions ?? [];
        if (!permissions.includes(permission)) {
            return res.status(403).json({
                error: "FORBIDDEN",
                message: `Missing permission: ${permission}`
            })
        }
        next()
    }
}
