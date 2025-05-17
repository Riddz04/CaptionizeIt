# CaptionizeIt 🎬📝

**CaptionizeIt** is a web application that simplifies the process of adding accurate, timestamped captions to media files using AI-powered transcription and editing tools.

## 🌐 Live Demo

👉 [captionizeit.vercel.app](https://captionizeit.vercel.app)

## 📸 Preview

https://res.cloudinary.com/dfyuhslyv/video/upload/v1747484482/wxzpv42w5gcclwe4y68p.mp4

## 🚀 Features

- 🎧 AI-powered transcription using WhisperX
- ⏱️ Accurate, timestamped captions
- ✏️ In-browser caption editing interface
- 💾 Download captions in `.srt` or other formats
- 🌐 Simple and responsive UI
- ☁️ Secure cloud storage via AWS S3
- 🎞️ Seamless caption embedding with FFmpeg

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Transcription**: [WhisperX](https://github.com/m-bain/whisperX)
- **Media Encoding**: FFmpeg
- **Storage**: AWS S3
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Riddz04/CaptionizeIt.git
cd CaptionizeIt
```
2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root with the following:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_S3_REGION=your_region
```

4. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:5173` to open the app.

## 🧪 Usage

1. Upload an audio/video file.
2. Let the AI transcribe the speech with timestamps.
3. Edit captions as needed.
4. Export the captions or embed them directly into the video.

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by [@Riddz04](https://github.com/Riddz04)
