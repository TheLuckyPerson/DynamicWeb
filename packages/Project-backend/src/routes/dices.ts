import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { DiceProvider } from "../DiceProvider";
import jwt from "jsonwebtoken"; // Add jwt to decode the token

export function registerDiceRoutes(app: express.Application, mongoClient: MongoClient) {
    app.get("/api/dices", async (req: Request, res: Response) => {
        console.log("route hit2");
        const diceProvider = new DiceProvider(mongoClient);

        let userId: string | undefined = undefined;
        let name: string | undefined = undefined;

        // Extract the Authorization header
        const authHeader = req.headers.authorization;

        // Extract username from token if available
        if (authHeader) {
            const token = authHeader.split(" ")[1]; // Assuming Bearer token format

            try {
                // Decode the token to extract the username
                const decoded = jwt.decode(token) as { username: string };
                userId = decoded?.username;
            } catch (error) {
                console.error("Error decoding token:", error);
                res.status(401).json({ message: "Invalid token" });
                return
            }
        }

        console.log("found " + userId)

        if (typeof req.query.name === "string") {
            name = req.query.name;
        }

        console.log("got name " + req.query.name)

        // Fetch dice from the database, applying the filters
        const dices = await diceProvider.getAllDices(userId, name);

        res.json(dices);
    });

    app.post(
        "/api/dices",
        async (req: Request, res: Response) => {
            const { name, selected, user } = req.body;
            console.log(req.body);
    
            if (name === "" || user === "") {
                console.log("bad req");
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing name"
                });
                return;
            }
    
            if (!Array.isArray(selected) || !selected.some((value) => value !== 0)) {
                console.log("Invalid selected array");
                res.status(400).send({
                    error: "Bad request",
                    message: "no dice selected"
                });
                return;
            }
    
            const diceProvider = new DiceProvider(mongoClient);
    
            const existingDice = await diceProvider.getDiceByNameAndUser(name, user);
    
            if (existingDice) {
                const updateResult = await diceProvider.updateDice(name, selected, user);
                if (!updateResult) {
                    res.status(500).send({
                        error: "Server error",
                        message: "Failed to update configuration"
                    });
                    return;
                }
            } else {
                const userStatus = await diceProvider.createDice({ name, selected, user });
                if (!userStatus) {
                    res.status(400).send({
                        error: "Bad request",
                        message: "cannot"
                    });
                    return;
                }
            }
    
            res.status(201).send();
        }
    );
    
}
