export function parseSRTContent(srtContent) {
    const blocks = srtContent.split("\n\n");

    const parsedData = blocks
        .map((block) => {
            const lines = block.split("\n");
            if (lines.length < 3) return null;

            const timingLine = lines[1];
            if (!timingLine.includes(" --> ")) return null; // Validate timing format

            const [start, end] = timingLine.split(" --> ");
            return {
                start: convertSRTTimeToSeconds(start),
                end: convertSRTTimeToSeconds(end),
                text: lines.slice(2).join(" ").trim(),
            };
        })
        .filter((item) => item && !isNaN(item.start) && !isNaN(item.end) && item.text);

    return parsedData;
}


// Helper function to convert SRT time format (hh:mm:ss,ms) to seconds
function convertSRTTimeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(":");
    const [secs, millis] = seconds.split(",");
    return (
        parseInt(hours) * 3600 + // Convert hours to seconds
        parseInt(minutes) * 60 + // Convert minutes to seconds
        parseInt(secs) +         // Add seconds
        parseInt(millis) / 1000  // Add milliseconds as fractional seconds
    );
}