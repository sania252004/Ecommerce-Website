import React from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read 'sort' from URL to keep dropdown in sync
  const currentSort = searchParams.get("sort") || "";

  const handleSortChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams); 

    if (value === "") {
      newParams.delete("sort"); // Clicking Default removes the param
    } else {
      newParams.set("sort", value);
    }

    setSearchParams(newParams); 
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low → High</option>
        <option value="priceDesc">Price: High → Low</option>
        <option value="newest">Newest Arrivals</option>
      </select>
    </div>
  );
};

export default SortOptions;