"use client"; // Add this to make the component a Client Component
import 'boxicons/css/boxicons.min.css'; // Import Boxicons CSS for styling

export default function DemoSection() {
  return (
    <section className="flex justify-around mt-12 items-center">
      <div className="bg-gray-700/20 w-[240px] h-[480px] rounded-xl"></div>
      <div>
        {/* Using custom box-icon element */}
        <box-icon name="magic-wand" type="solid" animation="tada" color = "green"></box-icon>
      </div>
      <div className="bg-gray-700/20 w-[240px] h-[480px] rounded-xl"></div>
    </section>
  );
}
