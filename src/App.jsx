import { Route, Routes } from "react-router-dom"
import HomePage from "./page/HomePage"
import ProductPage from "./page/ProductPage"
import { useDispatch } from "react-redux";
import { getAllProducts } from "./slice/productSlice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
  return (
   <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/product/:id" element={<ProductPage />} />
   </Routes>
  )
}

export default App