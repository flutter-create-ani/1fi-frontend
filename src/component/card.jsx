import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductById, setProductId } from "../slice/ProductIdSlice";

const Card = ({ product }) => {
  const { name, description, price, EmiOptions, variant } = product || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleDetails = () => {
    const productId =  product.id;
    if (productId) {
        
      dispatch(setProductId(productId));
      dispatch(getProductById(productId));
      navigate(`/product/${productId}`);
    }
  };

  const getImages = () => {
    if (!variant || !Array.isArray(variant) || variant.length === 0) {
      return [];
    }

    const firstVariant = variant[0];
    if (firstVariant?.image && Array.isArray(firstVariant.image)) {
      return firstVariant.image;
    }
    
    return [];
  };

  const images = getImages();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Section with Swiper */}
      <div className="w-full h-64 bg-gray-200 overflow-hidden relative">
        {images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={images.length > 1}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="h-full w-full [&_.swiper-button-next]:text-white [&_.swiper-button-next]:bg-black/50 [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:w-8 [&_.swiper-button-next]:h-8 [&_.swiper-button-next]:after:text-sm [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:bg-black/50 [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:w-8 [&_.swiper-button-prev]:h-8 [&_.swiper-button-prev]:after:text-sm [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet-active]:bg-blue-600"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`${name || "Product"} - Image ${index + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
          {name || "Product Name"}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-10">
          {description || "No description available"}
        </p>

        {/* Price and EMI Section */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{price?.finalPrice || "0"}
            </span>
          </div>
          {EmiOptions?.length > 0 && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              EMI Available
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button 
          onClick={handleDetails}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;

