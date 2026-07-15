
export default function PostLoading() {
  return (
    <div className="max-w-2xl mx-auto mt-10 animate-pulse">
      <div className="h-4 bg-surface rounded w-1/4 mb-4"></div>
      <div className="flex justify-between items-start">
        <div className="h-8 bg-surface rounded w-3/4"></div>
        <div className="h-8 bg-surface rounded w-20"></div>
      </div>
      <div className="h-4 bg-surface rounded w-1/3 mt-2 mb-6"></div>
      <div className="space-y-2">
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-2/3"></div>
      </div>
    </div>
  );
}