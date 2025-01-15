"use client";

import { generateSRTContent } from "@/libs/GenerateSRT";
import { useState, useEffect, useRef } from "react";
import ResultVideo from "./ResultVideo";
import TranscriptionItem from "./TranscriptionItem";
import { parseSRTContent } from "@/libs/TranscriptionHelpers";

export default function ClientComponent({ srtFile, filename }) {
  const [srtContent, setSrtContent] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoSectionRef = useRef(null);

  useEffect(() => {
    const fetchSrtContent = async () => {
      try {
        const response = await fetch(`/api/get-srt?file=${srtFile}`);
        if (!response.ok) throw new Error(`Failed to fetch SRT file: ${response.statusText}`);
        const content = await response.text();
        const parsedData = parseSRTContent(content);
        setSrtContent(parsedData);
      } catch (err) {
        setFetchError(err.message);
      }
    };

    const fetchVideoUrl = async () => {
      try {
        const response = await fetch(`/api/get-presigned-url?file=${filename}`);
        if (!response.ok) throw new Error(`Failed to fetch video URL: ${response.statusText}`);
        const data = await response.json();
        setVideoUrl(data.url);
      } catch (err) {
        setFetchError(err.message);
      }
    };

    fetchSrtContent();
    fetchVideoUrl();
  }, [srtFile, filename]);

  const handleJumpToVideo = () => {
    videoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSave = async () => {
    try {
      const updatedSRT = generateSRTContent(srtContent);
      const response = await fetch(`/api/save-srt`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: updatedSRT,
      });

      if (!response.ok) throw new Error(`Failed to save SRT file: ${response.statusText}`);
      alert("SRT file saved successfully!");
    } catch (err) {
      setSaveError(err.message);
      alert("Failed to save SRT file. Please try again.");
    }
  };

  const handleItemUpdate = (updatedItem, index) => {
    const updatedContent = [...srtContent];
    updatedContent[index] = updatedItem;
    setSrtContent(updatedContent);
  };

  return (
    <div className="p-4">
      {fetchError ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          <p>Error: {fetchError}</p>
          <p>Please refresh the page or contact support.</p>
        </div>
      ) : (
        <div>
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold mb-4 hover:text-green-500 transition-colors duration-300">
              Transcription and Video Preview
            </h2>
            <button
              onClick={handleSave}
              className="bg-green-500 py-2 px-6 rounded-full text-black border border-black mr-4"
            >
              Save Captions
            </button>
            <button
              onClick={handleJumpToVideo}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300 underline"
            >
              Jump to Video Preview
            </button>
          </div>

          <div className="overflow-y-auto h-full bg-black/50 p-4 rounded-md mb-8">
            <h3 className="text-xl font-semibold text-center mb-4">Transcription</h3>
            {srtContent.length > 0 ? (
              srtContent.map((item, index) => (
                <TranscriptionItem
                  key={index}
                  item={item}
                  onUpdate={(updatedItem) => handleItemUpdate(updatedItem, index)}
                />
              ))
            ) : (
              <p>Loading transcription results...</p>
            )}
          </div>

          {videoUrl ? (
            <ResultVideo videoUrl={videoUrl} srtContent={srtContent} />
          ) : (
            <p>Loading video preview...</p>
          )}
        </div>
      )}

      {saveError && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mt-4">
          <p>Error saving captions: {saveError}</p>
        </div>
      )}
    </div>
  );
}
