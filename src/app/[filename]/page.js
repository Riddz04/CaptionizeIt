import path from "path";
import processFile from "../../utils/processFile";
import ClientComponent from "../../components/ClientComponent";

export default async function FilePage({ params }) {
    const { filename } = params; // Extract `filename` from `params`
    const baseName = path.basename(filename, ".mp4");
    const srtFile = `${baseName}.srt`; // The expected .srt file output

    console.log(`Processing file: ${filename}`);

    try {
        // Call the Node.js processFile function
        await processFile(filename);
        console.log("File processed successfully.");
    } catch (error) {
        console.error(`Error during file processing: ${error.message}`);
        // Optionally, you can render an error message to the user
        return (
            <div>
                <p>Error occurred while processing the file: {error.message}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Pass both `filename` and `srtFile` to the client component */}
            <ClientComponent srtFile={srtFile} filename={filename} />
        </div>
    );
}
