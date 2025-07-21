export default function DashboardCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-white p-4 shadow rounded-md">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
