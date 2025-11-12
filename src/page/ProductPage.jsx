import React, { useEffect } from "react";
import ProductLayer from "../layer/ProductLayer";

const ProductPage = () => {
    useEffect(() => {
        document.title = "Product | 1Fi";
        return () => {
            document.title = "1Fi";
        }
    });
  return (
    <React.Fragment>
      <ProductLayer />
    </React.Fragment>
  )
}

export default ProductPage;