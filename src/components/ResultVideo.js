"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { fetchFile } from "@ffmpeg/util";
import { useState, useRef, useEffect } from "react";
import { generateSRTContent } from "@/libs/GenerateSRT";
import roboto from "@/app/fonts/Roboto-Regular.ttf";
import robotoBold from "@/app/fonts/Roboto-Bold.ttf";
import 'boxicons/css/boxicons.min.css'; // Import Boxicons CSS for styling

export default function ResultVideo({ videoUrl, srtContent }) {
  const [loaded, setLoaded] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [outlineColor, setOutlineColor] = useState("#000000");
  const [progress, setProgress] = useState(1);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoUrl) {
      videoRef.current.src = videoUrl;
      loadFFmpeg();
    }
  }, [videoUrl]);

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    await ffmpeg.writeFile("/tmp/roboto.ttf", await fetchFile(roboto));
    await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile(robotoBold));

    setLoaded(true);
  };

  const toFFmpegColor = (rgb) => {
    const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
    return "&H" + bgr + "&";
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;

    // Save updated SRT content
    const updatedSRT = generateSRTContent(srtContent);
    await ffmpeg.writeFile("subs.srt", new TextEncoder().encode(updatedSRT));

    // Transcode video with captions
    await ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl));
    const duration = videoRef.current.duration;

    ffmpeg.on("log", ({ message }) => {
      const regexResult = /time=([0-9:.]+)/.exec(message);
      if (regexResult?.[1]) {
        const [hours, minutes, seconds] = regexResult[1].split(":");
        const doneSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
        setProgress(doneSeconds / duration);
      }
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-vf",
      `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=30,PrimaryColour=${toFFmpegColor(
        primaryColor
      )},OutlineColour=${toFFmpegColor(outlineColor)}'`,
      "-preset",
      "ultrafast",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
    setProgress(1);
  };

  return (
    <div className="bg-black/50 p-4 rounded-md">
      <h3 className="text-xl font-semibold text-center mb-4">Video Preview</h3>
      <div className="mb-4">
        <button
          onClick={transcode}
          className="bg-green-500 py-2 px-6 rounded-full text-black inline-flex gap-2 border border-black cursor-pointer"
          disabled={!loaded || progress < 1}
        >
          <box-icon name="magic-wand" type="solid" animation="tada" color = "black"></box-icon>
          Captionize it!
        </button>
      </div>
      <div className="rounded-xl overflow-hidden relative">
        {progress < 1 && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-white text-lg font-semibold">
              {parseInt(progress * 100)}%
            </div>
          </div>
        )}
        <video ref={videoRef} controls className="w-full rounded-md mt-4" />
      </div>
    </div>
  );
}
