export default function Filters() {
  return (
    <div className="flex flex-wrap gap-4">
      <input
        placeholder="Search medicines..."
        className="flex-1 border rounded-lg px-4 py-2"
      />

      <select className="border rounded-lg px-3 py-2">
        <option>Antibiotic</option>
      </select>

      <select className="border rounded-lg px-3 py-2">
        <option>Sun Pharma</option>
      </select>

      <select className="border rounded-lg px-3 py-2 border-green-600">
        <option>Expiring</option>
      </select>

      <button className="border px-3 py-2 rounded-lg">⚲</button>
    </div>
  );
}