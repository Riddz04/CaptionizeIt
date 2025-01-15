import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return new Response(
                JSON.stringify({ error: "No file uploaded" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { name, type } = file;
        const data = await file.arrayBuffer();

        // Initialize the S3 client
        const s3client = new S3Client({
            region: process.env.AWS_REGION || "ap-south-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        // Generate a unique file name
        const id = uniqid();
        const ext = name.split(".").pop();
        const newName = `${id}.${ext}`;

        // Prepare the S3 upload command
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: newName,
            Body: data,
            ContentType: type,
            ACL: "public-read",
        });

        // Upload the file to S3
        await s3client.send(uploadCommand);

        // Construct the public URL of the uploaded file
        const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${newName}`;

        return new Response(
            JSON.stringify({
                name,
                ext,
                newName,
                id,
                message: "File uploaded successfully",
                url: fileUrl,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error uploading file:", error);

        return new Response(
            JSON.stringify({
                error: "Error uploading file",
                details: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
