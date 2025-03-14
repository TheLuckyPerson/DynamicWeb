import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../ImageProvider";
import { CredentialsProvider } from "../CredentialsProvider";

export function registerImageRoutes(app: express.Application, mongoClient: MongoClient) {
    app.get("/api/images", async (req: Request, res: Response) => {
        console.log("route hit");
        const imageProvider = new ImageProvider(mongoClient);

        let userId: string | undefined = undefined;
        if (typeof req.query.createdBy === "string") {
            userId = req.query.createdBy;
        }
        const images = await imageProvider.getAllImages(userId);

        res.json(images);
    });

    app.patch("/api/images/:id", async (req: Request, res: Response) => {
        const imageId = req.params.id;
        const { name } = req.body;

        console.log(`Image ID: ${imageId}`);
        console.log(`New Image Name: ${name}`);

        if (!name) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing name property"
            });
            return;
        }

        const imageProvider = new ImageProvider(mongoClient);
        const matchedCount = await imageProvider.updateImageName(imageId, name);

        if (matchedCount === 0) {
            res.status(404).send({
                error: "Not found",
                message: "Image does not exist"
            });
            return;
        }

        res.status(204).send();
    });

    app.post("/auth/register", async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
            return;
        }

        const credentialsProvider = new CredentialsProvider(mongoClient);

        const userStatus = await credentialsProvider.registerUser(username, password);

        if (!userStatus) {
            res.status(400).send({
                error: "Bad request",
                message: "Username already taken"
            });
            return;
        }


        // If user registration is successful
        res.status(201).send();
    });
}