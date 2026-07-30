import express from "express";
import authRoutes from "./modules/identity/routes/auth.routes";
import userRoutes from "./modules/identity/routes/users.routes";
import rbacRoutes from "./modules/identity/routes/rbac.routes";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok:true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/rbac", rbacRoutes);

export default app;
