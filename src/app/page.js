import DemoSection from "../components/DemoSection";
import PageHeaders from "../components/PageHeaders";
import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <>
      <PageHeaders 
      h1Text="Add Epic Captions to your video"
      h2Text="Just upload your video and we will do the rest"
      />
      <div className="text-center">
        <UploadForm />
      </div>
      <DemoSection />
    </>
  );
}