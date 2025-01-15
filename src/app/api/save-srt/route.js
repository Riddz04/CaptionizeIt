import { promises as fs } from "fs";
import * as path from "path";

export async function POST(req) {
  try {
    const srtContent = await req.text(); // Read the SRT content from the request body

    if (!srtContent) {
      return new Response(
        JSON.stringify({ error: "SRT content is missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const filePath = path.resolve(process.cwd(), "updated_captions.srt"); // Save to a specific path
    await fs.writeFile(filePath, srtContent, "utf-8");

    return new Response(
      JSON.stringify({ message: "SRT file saved successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error saving SRT file:", err);
    return new Response(
      JSON.stringify({ error: "Failed to save SRT file" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
