import { MongoClient, ObjectId } from "mongodb";

interface Image {
    _id: string;
    src: string;
    name: string;
    author: User;
    likes: number;
}

interface User {
    _id: string;
    username: string;
    email: string;
}

export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImages(authorId?: string): Promise<Image[]> {
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        const usersCollectionName = process.env.USERS_COLLECTION_NAME;
    
        if (!imagesCollectionName || !usersCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }
    
        const collection = this.mongoClient.db().collection(imagesCollectionName);
    
        const query: any = {};
    
        if (authorId) {
            query.author = authorId;  // Only fetch images for the given author
        }
    
        const images = await collection.find(query, {
            projection: {
                _id: 1,
                src: 1,
                name: 1,
                likes: 1,
                author: 1  
            }
        }).toArray();
    
        return images.map(image => ({
            _id: image._id.toString(), 
            src: image.src,
            name: image.name,
            likes: image.likes,
            author: image.author.toString() 
        }));
    }
    

    async updateImageName(imageId: string, newName: string): Promise<number> {
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!imagesCollectionName) {
            throw new Error("Missing collection name from environment variables");
        }

        const collection = this.mongoClient.db().collection(imagesCollectionName);
        let objectId: ObjectId;

        const result = await collection.updateOne(
            { _id: imageId as any }, 
            { $set: { name: newName } }
        );

        return result.matchedCount;
    }

    async createImage(imageData: { src: string, name: string, author: string }) {
        const imageCollection = this.mongoClient.db().collection("images");

        const result = await imageCollection.insertOne(imageData);
        return result
    }
}
