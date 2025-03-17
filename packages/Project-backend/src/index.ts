import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { ImageProvider } from "./ImageProvider";
import { registerImageRoutes } from "./routes/images";
import { registerAuthRoutes, verifyAuthToken } from "./routes/auth";
import { registerDiceRoutes } from "./routes/dices";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";

async function setUpSever() {
    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

    const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
    const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

    try {
        const mongoClient = await MongoClient.connect(connectionString);
        const collectionInfos = await mongoClient.db().listCollections().toArray();

        const app = express();
        app.use(express.static(staticDir));
        app.use("/uploads", express.static(process.env.IMAGE_UPLOAD_DIR || "uploads"));
        
        app.use(express.json());

        app.use("/api/*", verifyAuthToken);
        // registerImageRoutes(app, mongoClient);
        registerDiceRoutes(app, mongoClient);
        registerAuthRoutes(app, mongoClient);

        app.get("*", (req: Request, res: Response) => {
            console.log("none of the routes above me were matched");
            res.sendFile(path.resolve(staticDir, "index.html"));
        });

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.log("erorr occurered" + error);
    }
}


setUpSever();