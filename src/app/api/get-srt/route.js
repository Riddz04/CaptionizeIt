import { promises as fs } from "fs";
import * as path from "path";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const file = searchParams.get("file");

        if (!file) {
            return new Response(
                JSON.stringify({ error: "File parameter is missing" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Construct the file path relative to the root of the project
        const filePath = path.resolve(process.cwd(), file);

        // Check if the file exists
        try {
            await fs.access(filePath);
        } catch {
            return new Response(
                JSON.stringify({ error: `File not found: ${file}` }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Read the file content
        const content = await fs.readFile(filePath, "utf-8");
        return new Response(content, { status: 200, headers: { "Content-Type": "text/plain" } });
    } catch (err) {
        console.error(`Error reading SRT file: ${err.message}`);
        return new Response(
            JSON.stringify({ error: "Failed to read SRT file" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
