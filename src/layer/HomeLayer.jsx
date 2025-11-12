import { useSelector } from "react-redux";
import ShimmerLoader from "../component/shimmerLoader";
import Card from "../component/card";

export const HomeLayer = () => {
    const {products, loading, error} = useSelector((state) => state.getAllProducts);

    if (loading) {
        return <ShimmerLoader />;
    }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-1">
        {products.map((product) => (
            <Card key={product.id} product={product} />
        ))}
    </div>
  )
}

export default HomeLayer;