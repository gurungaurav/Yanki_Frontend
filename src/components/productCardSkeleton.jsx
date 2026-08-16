export default function ProductCardSkeleton() {
  return (
    <div className="group bg-white overflow-hidden animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-gray-200">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>

      {/* Product Info Skeleton */}
      <div className="py-4 px-1">
        {/* Category Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>

        {/* Product Name Skeleton */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
