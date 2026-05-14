import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

const Collection = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const { products, loading, error } = useSelector((state) => state.products);
  
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. Extract all current URL params into an object
    const queryParams = Object.fromEntries([...searchParams]);

    // 2. Build the final fetch object
    const fetchParams = { 
      ...queryParams,
      // Ensure the 'sort' key from URL is explicitly mapped to 'sortBy'
      sortBy: searchParams.get("sort") || "" 
    };

    // 3. Handle 'all' collection logic 
    if (collection && collection !== "all") {
      fetchParams.collection = collection;
    }

    // 4. Dispatch the API call
    dispatch(fetchProductsByFilters(fetchParams));
    
  }, [dispatch, collection, searchParams]); // Triggers on every URL change

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full overflow-x-hidden">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border-b p-3 flex items-center justify-center gap-2"
      >
        <FaFilter /> Filters
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold uppercase">
            {collection === "all" ? "All Products" : `${collection} Collection`}
          </h2>
          {/* Ensure SortOptions is correctly updating searchParams */}
          <SortOptions />
        </div>
        
        {/* Added a key based on product length/sort to ensure fresh render */}
        <ProductGrid 
          key={`${searchParams.get("sort")}-${products.length}`}
          products={products} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default Collection;