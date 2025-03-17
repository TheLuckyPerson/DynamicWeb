import { MongoClient, ObjectId } from "mongodb";

interface DiceConfig {
    _id: string;
    name: string;
    selected: Array<string>;
    user: string;
}

export class DiceProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllDices(userId?: string, name?: string): Promise<DiceConfig[]> {
        const diceCollectionName = process.env.DICES_COLLECTION_NAME;
        const usersCollectionName = process.env.CREDS_COLLECTION_NAME;
    
        if (!diceCollectionName || !usersCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }
    
        const collection = this.mongoClient.db().collection(diceCollectionName);
        const query: any = {};
    
        if (userId) {
            query.user = userId;  // Only fetch dices for the given author
        }

        if(name) {
            query.name = name
        }
    
        const dices = await collection.find(query, {
            projection: {
                _id: 1,
                name: 1,
                selected: 1,
                user: 1  
            }
        }).toArray();

        return dices.map(dice => ({
            _id: dice._id.toString(), 
            name: dice.name,
            selected: dice.selected,
            user: dice.user.toString() 
        }));
    }

    async createDice(diceData: { 
            name: string, 
            selected: number[], 
            user: string }) {
        const diceCollection = this.mongoClient.db().collection("diceConfigs");
        const result = await diceCollection.insertOne({
            name: diceData.name,
            selected: diceData.selected,
            user: diceData.user
        });
        return result
    }

    async getDiceByNameAndUser(name: string, user: string) {
        const diceCollection = this.mongoClient.db().collection("diceConfigs");

        return await diceCollection.findOne({ name, user });
    }
    
    async updateDice(name: string, selected: number[], user: string) {

        const diceCollection = this.mongoClient.db().collection("diceConfigs");

        return await diceCollection.updateOne(
            { name, user },
            { $set: { selected } },
            { upsert: true }
        );
    }
}
