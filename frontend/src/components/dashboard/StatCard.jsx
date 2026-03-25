export default function StatCard({ title, value, subtitle, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-slate-500 font-medium">{title}</span>
        <span className="text-3xl font-bold text-slate-800 tracking-tight">
          {value?.toLocaleString?.() ?? value}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-400 mt-0.5">{subtitle}</span>
        )}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  );
}