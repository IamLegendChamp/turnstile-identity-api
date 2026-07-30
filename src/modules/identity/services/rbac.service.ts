import { Role } from "../models/Role";
import { User } from "../models/User";

export async function listRoles() {
    return Role.find().lean();
}

export async function assignRolesToUser(userId: string, roles: string[]) {
    const existingRoles = await Role.find({ name: { $in: roles } });
    if (existingRoles.length !== roles.length) {
        const err = new Error("One or more roles do not exist") as Error & { status: number };
        err.status = 400;
        throw err;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { roles },
        { new: true }
    ).select("-passwordHash -refreshTokenHash");

    if (!user) {
        const err = new Error("User not found") as Error & { status: number };
        err.status = 404;
        throw err;
    }

    return user
}