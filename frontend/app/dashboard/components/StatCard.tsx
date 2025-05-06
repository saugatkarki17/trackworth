type Props = {
    title: string;
    value: string;
    change: string;
  };
  
  export default function StatCard({ title, value, change }: Props) {
    const isPositive = change.startsWith("+");
    return (
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className={`text-sm mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>{change}</p>
      </div>
    );
  }
  