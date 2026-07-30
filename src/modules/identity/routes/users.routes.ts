import { Router } from "express";

import { verifyJwt } from "../../../shared/middleware/verifyJwt";
import { requirePermission } from "../../../shared/middleware/requirePermission";
import { User } from "../models/User";

const router = Router();

router.get(
    "/",
    verifyJwt,
    requirePermission("admin:user:read"),
    async(_req, res) => {
        const users = await User.find().select("-passwordHash -refreshTokenHash");
        return res.json(users);
    }
)

export default router;
