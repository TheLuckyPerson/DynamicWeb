import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../ImageProvider";
import { CredentialsProvider } from "../CredentialsProvider";
import { imageMiddlewareFactory, handleImageFileErrors } from "./imageUploadMiddleware";

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

        res.status(201).send();
    });

    app.post(
        "/api/images",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        async (req: Request, res: Response) => {
            try {
                // Log the incoming request details for debugging
                console.log("File Upload Request:", req.body);  // Form data (image name, etc.)
                console.log("File details:", req.file);  // File details (uploaded file)
    
                if (!req.file) {
                    res.status(400).send({
                        error: "Bad Request",
                        message: "No file uploaded"
                    });
                    return
                }
    
                if (!req.body.name) {
                    res.status(400).send({
                        error: "Bad Request",
                        message: "Image name is required"
                    });
                    return
                }
    
                // Assuming the user is authenticated and token is attached to res.locals.token
                const user = res.locals.token;
                if (!user) {
                    res.status(401).send({
                        error: "Unauthorized",
                        message: "User not authenticated"
                    });
                    return
                }
    
                const imageData = {
                    _id: req.file.filename,
                    src: `/uploads/${req.file.filename}`,
                    name: req.body.name || "Untitled",
                    likes: 0,
                    author: user.username
                };
    
                const imageProvider = new ImageProvider(mongoClient);
                const newImage = await imageProvider.createImage(imageData);
    
                res.status(201).json(newImage);
            } catch (error) {
                console.error("Error processing file upload:", error);
                res.status(500).send({
                    error: "Internal Server Error",
                    message: "Error processing the image upload"
                });
            }
        }
    );
}
