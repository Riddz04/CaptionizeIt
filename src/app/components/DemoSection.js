"use client"; // Add this to make the component a Client Component

import { useEffect } from "react";
import 'boxicons/css/boxicons.min.css'; // Import Boxicons CSS for styling

export default function DemoSection() {

  // Load Boxicons script on the client side only
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/boxicons@2.1.4/dist/boxicons.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="flex justify-around mt-12 items-center">
      <div className="bg-gray-700/20 w-[240px] h-[480px] rounded-xl"></div>
      <div>
        {/* Using custom box-icon element */}
        <box-icon name="magic-wand" type="solid" animation="tada" color = "white"></box-icon>
      </div>
      <div className="bg-gray-700/20 w-[240px] h-[480px] rounded-xl"></div>
    </section>
  );
}
