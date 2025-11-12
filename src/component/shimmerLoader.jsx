import React from "react";

// Single shimmer card skeleton
const ShimmerCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Section */}
      <div className="w-full h-64 bg-gray-300"></div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name */}
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>

        {/* Description */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>

        {/* Price and EMI Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-8 bg-gray-300 rounded w-24"></div>
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
        </div>
        {/* Button */}
        <div className="w-full h-10 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

const ShimmerLoader = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default ShimmerLoader;