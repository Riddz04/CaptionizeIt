import ffmpeg from "fluent-ffmpeg";
import AWS from "aws-sdk";
import path from "path";
import { exec } from "child_process";
import fs from "fs/promises";

const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;

if (!BUCKET_NAME || !AWS_REGION) {
  throw new Error("BUCKET_NAME and AWS_REGION environment variables must be set.");
}

// AWS S3 configuration
const s3 = new AWS.S3({
  region: AWS_REGION,
});

/**
 * Logs a message with a timestamp for debugging purposes.
 */
const log = (message) => {
  console.log(`[${new Date().toISOString()}] - ${message}`);
};

/**
 * Optimizes an MP4 video file using FFmpeg.
 */
const optimizeVideo = async (inputFile, outputFile) => {
  log("Optimizing video file...");
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .videoCodec("libx264")
      .outputOptions("-crf 28") // Adjust CRF for quality/size tradeoff
      .on("end", () => {
        log(`Video optimization completed: ${outputFile}`);
        resolve(outputFile);
      })
      .on("error", (err) => {
        reject(new Error(`Video optimization failed: ${err.message}`));
      })
      .save(outputFile);
  });
};

/**
 * Converts an MP4 video to WAV format.
 */
const convertToWav = async (inputFile, outputFile) => {
  log("Converting MP4 to WAV...");
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .noVideo()
      .audioCodec("pcm_s16le")
      .audioChannels(2)
      .audioFrequency(44100)
      .on("end", () => {
        log(`MP4 to WAV conversion completed: ${outputFile}`);
        resolve(outputFile);
      })
      .on("error", (err) => {
        reject(new Error(`MP4 to WAV conversion failed: ${err.message}`));
      })
      .save(outputFile);
  });
};

/**
 * Transcribes a WAV file using WhisperX CLI.
 */
const transcribeAudio = async (wavFile, transcriptionFile) => {
  log("Starting transcription...");
  return new Promise((resolve, reject) => {
    exec(
      `whisperx --compute_type float32 --device cpu "${wavFile}" > "${transcriptionFile}"`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(`Transcription failed: ${stderr || error.message}`));
        }
        log("Transcription completed successfully.");
        resolve(transcriptionFile);
      }
    );
  });
};

/**
 * Main function to handle processing.
 */
const processFile = async (filename) => {
  if (!filename) throw new Error("Filename is required.");

  const baseName = path.basename(filename, ".mp4");
  const optimizedVideo = `${baseName}_optimized.mp4`;
  const wavFile = `${baseName}.wav`;
  const transcriptionDir = "./Transcription";
  const transcriptionFile = path.join(transcriptionDir, `${baseName}_transcription.txt`);

  try {
    // Ensure Transcription directory exists
    await fs.mkdir(transcriptionDir, { recursive: true });

    // Step 1: Download file from S3
    log("Downloading file from S3...");
    const s3Object = await s3.getObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
    await fs.writeFile(filename, s3Object.Body);
    log(`File downloaded from S3: ${filename}`);

    // Step 2: Optimize the video
    await optimizeVideo(filename, optimizedVideo);

    // Step 3: Convert MP4 to WAV
    await convertToWav(optimizedVideo, wavFile);

    // Step 4: Transcribe WAV file
    await transcribeAudio(wavFile, transcriptionFile);

    // Optional Cleanup
    await fs.unlink(wavFile);
    log("Temporary WAV file deleted.");

    log("Processing completed successfully.");
    log(`Transcription file saved to: ${transcriptionFile}`);
  } catch (err) {
    log(`Error: ${err.message}`);
    throw err;
  }
};

export default processFile;
