import { MongoClient } from "mongodb";

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

    async getAllImages(): Promise<Image[]> {
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        const usersCollectionName = process.env.USERS_COLLECTION_NAME;

        if (!imagesCollectionName || !usersCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }

        const collection = this.mongoClient.db().collection(imagesCollectionName);

        const images = await collection
            .aggregate<Image>([ // Explicitly specify the output type
                {
                    $lookup: {
                        from: usersCollectionName,
                        localField: "author",
                        foreignField: "_id",
                        as: "authorDetails",
                    },
                },
                { $unwind: "$authorDetails" }, // Convert array to object
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
                },
            ])
            .toArray();

        return images;
    }
}
