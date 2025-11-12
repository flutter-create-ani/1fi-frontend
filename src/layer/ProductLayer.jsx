import { useSelector, useDispatch } from "react-redux";
import ShimmerLoader from "../component/shimmerLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useParams } from "react-router-dom";
import { setProductId, getProductById } from "../slice/ProductIdSlice";
import { useEffect, useState } from "react";

const ProductLayer = () => {
  const dispatch = useDispatch();
  const { product, loading, error, productId } = useSelector((state) => state.getProductById);
  const { id } = useParams();
  const [selectedEmiPlan, setSelectedEmiPlan] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (id && (!productId || productId !== id)) {
      dispatch(setProductId(id));
      dispatch(getProductById(id));
    }
  }, [id, dispatch, productId]);

  // Handle both array and single object responses - do this before conditional returns
  const productData = product?.data ? (Array.isArray(product.data) ? product.data[0] : product.data) : null;
  const variant = productData?.variant;

  // Set default variant on mount - must be before conditional returns
  useEffect(() => {
    if (variant && variant.length > 0 && !selectedVariant) {
      setSelectedVariant(variant[0]);
    }
  }, [variant, selectedVariant]);

  // Now we can do conditional returns
  if (loading) {
    return <ShimmerLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Error loading product</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product || !product.data || !productData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const { name, description, price, EmiOptions, storage, isNewProduct } = productData;

  // Get images from selected variant or first variant
  const getImages = () => {
    const currentVariant = selectedVariant || (variant && variant.length > 0 ? variant[0] : null);
    if (currentVariant?.image && Array.isArray(currentVariant.image)) {
      return currentVariant.image;
    }
    return [];
  };

  const images = getImages();
  const finalPrice = price?.finalPrice || 0;
  const originalPrice = price?.originalPrice || 0;
  const discount = price?.percentageDiscount || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Product Image */}
        <div className="space-y-4">
          {/* NEW Badge */}
          {isNewProduct && (
            <div className="inline-block">
              <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded">
                NEW
              </span>
            </div>
          )}

          {/* Product Name */}
          <h1 className="text-4xl font-bold text-gray-900">{name}</h1>

          {/* Storage */}
          {storage && storage.length > 0 && (
            <p className="text-xl text-gray-600">{storage.join(", ")}</p>
          )}

          {/* Image Swiper */}
          <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            {images.length > 0 ? (
              <Swiper
                key={selectedVariant?._id || 'default'}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={images.length > 1}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="h-full w-full product-swiper"
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={`${name} - Image ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/600x500?text=No+Image";
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                <svg
                  className="w-24 h-24"
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

          {/* Variant Selection */}
          {variant && variant.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select Variant: {variant.length} {variant.length === 1 ? "option" : "options"} available
              </p>
              <div className="flex flex-wrap gap-3">
                {variant.map((v, index) => (
                  <button
                    key={v._id || index}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedVariant?._id === v._id
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Pricing and EMI */}
        <div className="space-y-6">
          {/* Price Section */}
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                ₹{finalPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
              {originalPrice > finalPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-green-600 font-medium">
                {discount}% off
              </p>
            )}
          </div>

          {/* Description */}
          {description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          )}

          {/* EMI Section */}
          {EmiOptions && EmiOptions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                EMI plans backed by mutual funds
              </h3>
              <div className="space-y-3">
                {EmiOptions.map((emi) => (
                  <div
                    key={emi._id}
                    onClick={() => setSelectedEmiPlan(emi)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedEmiPlan?._id === emi._id
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="emiPlan"
                          checked={selectedEmiPlan?._id === emi._id}
                          onChange={() => setSelectedEmiPlan(emi)}
                          className="w-5 h-5 text-blue-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{emi.emiAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-gray-600 ml-2">x {emi.duration} months</span>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          emi.interestRate === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {emi.interestRate === 0 ? "0% interest" : `${emi.interestRate}% interest`}
                      </span>
                    </div>
                    {emi.additionalCashback > 0 && (
                      <p className="text-sm text-green-600 font-medium ml-8">
                        Additional cashback of ₹{emi.additionalCashback.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <div className="pt-4">
            <button
              onClick={() => {
                if (selectedEmiPlan) {
                  // Handle proceed action
                  console.log("Selected Plan:", selectedEmiPlan);
                  console.log("Selected Variant:", selectedVariant);
                  alert(`Proceeding with:\nEMI Plan: ₹${selectedEmiPlan.emiAmount}/month for ${selectedEmiPlan.duration} months\nVariant: ${selectedVariant?.name || "Default"}`);
                }
              }}
              disabled={!selectedEmiPlan}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                selectedEmiPlan
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedEmiPlan
                ? `Proceed with ₹${selectedEmiPlan.emiAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}/month`
                : "Select an EMI plan to proceed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLayer;
