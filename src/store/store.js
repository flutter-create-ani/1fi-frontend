import { configureStore } from "@reduxjs/toolkit"
import getAllProductsReducer from "../slice/productSlice"
import getProductByIdReducer from "../slice/ProductIdSlice"

const store = configureStore({
  reducer: {
    getAllProducts: getAllProductsReducer,
    getProductById: getProductByIdReducer,
  },
})

export default store