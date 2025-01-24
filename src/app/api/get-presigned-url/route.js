import * as AWS from "aws-sdk";

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

// Handle GET requests
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const file = searchParams.get("file");

        if (!file) {
            return new Response(
                JSON.stringify({ error: "File name is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const params = {
            Bucket: "riddhi-captionize", // Replace with your S3 bucket name
            Key: file,
            Expires: 60 * 5, // URL expiry time in seconds
        };

        const url = s3.getSignedUrl("getObject", params);
        return new Response(
            JSON.stringify({ url }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Failed to generate pre-signed URL" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
