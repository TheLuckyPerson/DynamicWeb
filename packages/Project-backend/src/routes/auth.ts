import jwt from "jsonwebtoken";
import { CredentialsProvider } from "../CredentialsProvider";
import { MongoClient } from "mongodb";
import express, { NextFunction, Request, Response } from "express";

export function verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction // Call next() to run the next middleware or request handler
) {
    const signatureKey = process.env.JWT_SECRET
    if (!signatureKey) {
        throw new Error("Missing JWT_SECRET from env file");
    }

    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token)
    if (!token) {
        res.status(401).end();
    } else { // signatureKey already declared as a module-level variable
        jwt.verify(token, signatureKey as string, (error, decoded) => {
            if (decoded) {
                res.locals.token = decoded;
                next();
            } else {
                res.status(403).end();
            }
        });
    }
}

export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    const signatureKey = process.env.JWT_SECRET
    if (!signatureKey) {
        throw new Error("Missing JWT_SECRET from env file");
    }

    function generateAuthToken(username: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            jwt.sign(
                { username: username },
                signatureKey as string,
                { expiresIn: "1d" },
                (error, token) => {
                    if (error) reject(error);
                    else resolve(token as string);
                }
            );
        });
    }

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

    app.post("/auth/login", async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });

            return;
        }

        const creditialsProvider = new CredentialsProvider(mongoClient);
        const isValid = await creditialsProvider.verifyPassword(username, password);

        if (isValid) {
            const token = await generateAuthToken(username);
            res.send({ token });
        } else {
            res.status(401).send({
                error: "Unauthorized",
                message: "Incorrect username or password"
            });
        }
    });
}