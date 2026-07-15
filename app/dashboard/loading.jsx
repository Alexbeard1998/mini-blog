
export default function DashboardLoading() {
  return (
    <div className="max-w-2xl mx-auto mt-10 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-surface rounded w-1/3"></div>
        <div className="h-10 bg-surface rounded w-32"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-surface rounded"></div>
        ))}
      </div>
    </div>
  );
}