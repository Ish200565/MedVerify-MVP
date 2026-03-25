export default function MedicineTable() {
  const data = [
    {
      name: "Amoxicillin 500mg",
      type: "Antibiotic",
      manufacturer: "Cipla",
      stock: 450,
      expiry: "2025-08-15",
      status: "In Stock",
    },
    {
      name: "Paracetamol 650mg",
      type: "Analgesic",
      manufacturer: "Sun Pharma",
      stock: 1200,
      expiry: "2026-01-20",
      status: "In Stock",
    },
  ];

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-4">Medicine Name</th>
            <th>Type</th>
            <th>Manufacturer</th>
            <th>Stock</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th className="text-right pr-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="p-4 font-medium">{item.name}</td>
              <td>{item.type}</td>
              <td>{item.manufacturer}</td>
              <td>{item.stock}</td>
              <td>{item.expiry}</td>
              <td>
                <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                  {item.status}
                </span>
              </td>
              <td className="text-right pr-4">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}