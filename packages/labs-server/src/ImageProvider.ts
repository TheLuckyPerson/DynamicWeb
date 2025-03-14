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
    
        const pipeline: any[] = [
            {
                $lookup: {
                    from: usersCollectionName,
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                },
            },
            { $unwind: "$authorDetails" },
            {
                $project: {
                    _id: 1,
                    src: 1,
                    name: 1,
                    likes: 1,
                    author: {
                        _id: "$authorDetails._id",
                        username: "$authorDetails.username",
                        email: "$authorDetails.email",
                    },
                },
            }
        ];
    
        if (authorId) {
            pipeline.unshift({ $match: { author: authorId } });
        }
    
        const images = await collection.aggregate<Image>(pipeline).toArray();
    
        return images;
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
}
