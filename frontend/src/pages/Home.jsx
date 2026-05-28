import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Layout/Hero.jsx";
import FeaturedCollection from "../components/Products/FeaturedCollection.jsx";
import FeaturedSection from "../components/Products/FeaturedSection.jsx";
import GenderCollection from "../components/Products/GenderCollection.jsx";
import NewArrivals from "../components/Products/NewArrivals.jsx";
import Productdetails from "../components/Products/Productdetails.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [bestSellerLoading, setBestSellerLoading] = useState(true); // ✅ Track loading

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        limit: 4,
      }),
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
        );
        
        console.log("Best Seller Raw Response:", response.data);

        // Defensive Extract: Check if the response contains the direct product or a nested object property
        if (response.data && response.data._id) {
          // Direct product object received
          setBestSellerProduct(response.data);
        } else if (response.data && response.data.product) {
          // Wrapped inside a 'product' object key
          setBestSellerProduct(response.data.product);
        } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // If the endpoint accidentally returns an array instead of a single object, grab the first one
          setBestSellerProduct(response.data[0]);
        } else {
          console.error("Unexpected best-seller format:", response.data);
          setBestSellerProduct(null);
        }
      } catch (error) {
        console.error("Best Seller Fetch Error:", error);
        setBestSellerProduct(null);
      } finally {
        setBestSellerLoading(false); // ✅ Stop loading regardless of result
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Seller Section */}
      <section className="mt-20">
        <h2 className="text-5xl text-center font-bold mb-4">
          Best Selling Product
        </h2>

        {bestSellerLoading ? (
          <p className="text-center text-gray-400">
            Loading Best Seller Product...
          </p>
        ) : bestSellerProduct && bestSellerProduct._id ? (
          <Productdetails productId={bestSellerProduct._id} />
        ) : (
          <p className="text-center text-gray-400">No best seller found.</p> // ✅ Clear fallback
        )}

        <div className="container mx-auto mt-20">
          <h2 className="text-3xl text-center font-bold mb-4">
            Top Wears For Women
          </h2>
          <ProductGrid
            products={Array.isArray(products) ? products : []}
            loading={loading}
            error={error}
          />
        </div>
      </section>

      <FeaturedCollection />
      <FeaturedSection />
    </div>
  );
};

export default Home;