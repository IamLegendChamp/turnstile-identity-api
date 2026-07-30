import { Router } from "express";
import { verifyJwt } from "../../../shared/middleware/verifyJwt";
import { requirePermission } from "../../../shared/middleware/requirePermission";
import { assignRolesToUser, listRoles } from "../services/rbac.service";

const router = Router()

router.get(
    "/roles",
    verifyJwt,
    requirePermission("admin:role:assign"),
    async(_req, res) => {
        const roles = await listRoles();
        return res.json(roles);
    }
)

router.post(
    "/users/:id/roles",
    verifyJwt,
    requirePermission("admin:role:assign"),
    async(req, res) => {
        try {
            const { roles } = req.body;
            if(!Array.isArray(roles)) {
                return res.status(400).json({
                    error: "BAD_REQUEST",
                    message: "roles must be an array of role names"
                })
            }
            const user = await assignRolesToUser(req.params.id, roles);
            return res.json(user)
        } catch(e:unknown) {
            const err = e as Error & { status?: number }
            return res.status(err.status ?? 500).json({
                error: err.status === 404 ? "NOT_FOUND" : "BAD_REQUEST",
                message: err.message
            })
        }
    }
)

export default router;
