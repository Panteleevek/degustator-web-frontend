const LoadingFeed = () => {
  return (
    <div className="divide-y divide-gray-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>
          <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingFeed