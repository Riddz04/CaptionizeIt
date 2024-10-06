'use client';
import { useState } from 'react';
import UploadIcon from "./UploadIcon";
import axios from 'axios';

export default function UploadForm() {
    const [uploadStatus, setUploadStatus] = useState('');

    async function upload(ev) {
        ev.preventDefault();
        const files = ev.target.files;
        if (files.length > 0) {
            const file = files[0];
            setUploadStatus('Uploading...');
            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(res.data);
                setUploadStatus('Upload successful!');
            } catch (error) {
                console.error('Upload error:', error);
                setUploadStatus('Upload failed. Please try again.');
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error(error.response.data);
                    console.error(error.response.status);
                    console.error(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error', error.message);
                }
            }
        }
    }

    return (
        <div>
            <label className="bg-green-500 py-2 px-6 rounded-full text-black inline-flex gap-1 border border-black cursor-pointer">
                <UploadIcon />
                <span>Choose your file</span>
                <input onChange={upload} type="file" className="hidden"/>
            </label>
            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
        </div>
    );
}