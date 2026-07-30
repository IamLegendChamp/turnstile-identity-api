import mongoose from "mongoose";
import app from "./app";
import { initKeys } from "./modules/identity/lib/jwt";

const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/identity_practice";

async function main() {
    await initKeys();
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");

    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});