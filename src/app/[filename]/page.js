import { exec } from "child_process";
import path from "path";
import ClientComponent from "../../components/ClientComponent";

export default async function FilePage({ params }) {
    const { filename } = await params; // Extract `filename` from `params`
    const baseName = path.basename(filename, ".mp4");
    const srtFile = `${baseName}.srt`; // Update to use `.srt` file

    console.log(`Processing file: ${filename}`);

    // Run the shell script
    await new Promise((resolve, reject) => {
        exec(
            `BUCKET_NAME=${process.env.BUCKET_NAME} AWS_REGION=${process.env.AWS_REGION} FILENAME=${filename} ./convert_mp4_to_wav.sh`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error during processing: ${error.message}`);
                    reject(error.message);
                    return;
                }
                if (stderr) {
                    console.warn(`Shell script stderr: ${stderr}`);
                }
                console.log(`Shell script stdout: ${stdout}`);
                resolve();
            }
        );
    });

    return (
        <div>
            {/* Pass both `filename` and `srtFile` */}
            <ClientComponent srtFile={srtFile} filename={filename} />
        </div>
    );
}
