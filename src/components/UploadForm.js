'use client';
import { useState } from 'react';
import UploadIcon from "./UploadIcon";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
    const [uploading, setUploading] = useState(false); // Track if upload is in progress
    const [uploadSuccess, setUploadSuccess] = useState(false); // Track if upload was successful
    const router = useRouter();

    async function upload(ev) {
        ev.preventDefault();
        const files = ev.target.files;

        if (files.length > 0) {
            const file = files[0];
            setUploading(true); // Show loading screen
            setUploadSuccess(false); // Reset success message
            try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setUploading(false); // Hide loading screen
                setUploadSuccess(true); // Show success message
                const newName = res.data.newName;
                router.push('/' + newName);
            } catch (error) {
                console.error('Upload error:', error);
                setUploading(false); // Hide loading screen
                alert('Upload failed. Please try again.'); // Optional alert for errors
            }
        }
    }

    return (
        <div className="relative">
            {/* Loading Screen */}
            {uploading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold text-black">Uploading...</p>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold text-green-600">Upload Successful!</p>
                        <button
                            onClick={() => setUploadSuccess(false)}
                            className="mt-4 bg-green-500 text-white py-1 px-4 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* File Upload Form */}
            <label className="bg-green-500 py-2 px-6 rounded-full text-black inline-flex gap-1 border border-black cursor-pointer">
                <UploadIcon />
                <span>Choose your file</span>
                <input onChange={upload} type="file" className="hidden" />
            </label>
        </div>
    );
}
