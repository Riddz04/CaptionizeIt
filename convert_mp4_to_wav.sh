#!/bin/bash

# Ensure required environment variables are set
if [ -z "$BUCKET_NAME" ] || [ -z "$AWS_REGION" ] || [ -z "$FILENAME" ]; then
    echo "Error: BUCKET_NAME, AWS_REGION, and FILENAME must be set as environment variables."
    exit 1
fi

# Log function for better debugging
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

log "Bucket Name: $BUCKET_NAME"
log "AWS Region: $AWS_REGION"
log "Filename: $FILENAME"

# Define paths
BASE_NAME=$(basename "$FILENAME" .mp4)
S3_URL="https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${FILENAME}"
WAV_FILE="${BASE_NAME}.wav"
OPTIMIZED_VIDEO="${BASE_NAME}_optimized.mp4"
TRANSCRIPTION_DIR="./Transcription"
TRANSCRIPTION_FILE="${TRANSCRIPTION_DIR}/${BASE_NAME}_transcription.txt"

# Ensure Transcription directory exists
mkdir -p "$TRANSCRIPTION_DIR"

# Step 1: Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    log "FFmpeg is not installed. Attempting to install FFmpeg..."
    brew install ffmpeg
    if ! command -v ffmpeg &> /dev/null; then
        log "FFmpeg installation failed. Please install FFmpeg manually."
        exit 1
    fi
fi

# Step 2: Optimize MP4 file size by adjusting CRF
log "Optimizing video file size using CRF..."
ffmpeg -i "$S3_URL" -vcodec libx264 -crf 28 "$OPTIMIZED_VIDEO"
if [ $? -ne 0 ]; then
    log "Error: Video optimization failed."
    exit 1
fi
log "Video optimization completed: $OPTIMIZED_VIDEO"

# Step 3: Convert MP4 to WAV
log "Converting MP4 to WAV..."
ffmpeg -i "$OPTIMIZED_VIDEO" -vn -acodec pcm_s16le -ar 44100 -ac 2 "$WAV_FILE"
if [ $? -ne 0 ]; then
    log "Error: MP4 to WAV conversion failed."
    exit 1
fi
log "MP4 to WAV conversion completed: $WAV_FILE"

# Step 4: Transcribe WAV with WhisperX
log "Starting transcription..."
whisperx --compute_type float32 --device cpu "$WAV_FILE" > "$TRANSCRIPTION_FILE"
if [ $? -ne 0 ]; then
    log "Error: Transcription failed."
    exit 1
fi
log "Transcription completed successfully."
log "Transcription saved to: $TRANSCRIPTION_FILE"

# Optional Cleanup
rm "$WAV_FILE"

log "Processing completed."
