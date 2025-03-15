import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";

class ImageFormatError extends Error {}

function getFileExtension(mimetype: string) {
    switch (mimetype) {
        case "image/png":
            return "png";
        case "image/jpg":
        case "image/jpeg":
            return "jpg";
        default:
            return null; 
    }
}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads"; 
        cb(null, path.join(__dirname, uploadDir)); 
    },
    filename: function (req, file, cb) {
        const fileExtension = getFileExtension(file.mimetype); 
        if (!fileExtension) {
            return cb(new ImageFormatError("Unsupported image type"), "");
        }

        const fileName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "." + fileExtension;
        cb(null, fileName); 
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); 
}
