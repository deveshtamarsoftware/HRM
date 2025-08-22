interface CardProps {
  title: string;
  value: string | number;
  color: string; // e.g. "text-yellow-600"
  icon: React.ReactNode;
}

export const Card = ({ title, value, color, icon }: CardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition">
      <div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
        <div className={`text-2xl ${color}`}>{icon}</div>
      </div>
      <div>
        <h4 className="text-xl font-bold text-gray-800">{value}</h4>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
};