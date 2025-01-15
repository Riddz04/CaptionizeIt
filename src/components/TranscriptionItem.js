export default function TranscriptionItem({ item, onUpdate }) {
  const handleChange = (field, value) => {
    const updatedItem = { ...item, [field]: value };
    onUpdate(updatedItem); // Notify parent of the change
  };

  return (
    <div className="grid grid-cols-3 gap-2 items-center my-1">
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md text-center"
        value={item.start}
        onChange={(e) => handleChange("start", e.target.value)}
      />
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md text-center"
        value={item.end}
        onChange={(e) => handleChange("end", e.target.value)}
      />
      <input
        type="text"
        className="bg-white/20 p-1 rounded-md w-full"
        value={item.text}
        onChange={(e) => handleChange("text", e.target.value)}
      />
    </div>
  );
}
