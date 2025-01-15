// Utility to generate SRT content
export function generateSRTContent(transcriptions) {
    return transcriptions
      .map((item, index) => {
        const start = convertSecondsToSRTTime(item.start);
        const end = convertSecondsToSRTTime(item.end);
        return `${index + 1}\n${start} --> ${end}\n${item.text}\n`;
      })
      .join("\n\n");
  }
  
  function convertSecondsToSRTTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    const millis = Math.floor((seconds * 1000) % 1000).toString().padStart(3, "0");
    return `${hrs}:${mins}:${secs},${millis}`;
  }
  