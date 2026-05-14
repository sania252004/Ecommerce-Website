import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/* -------------------- Reusable UI Components -------------------- */

const FilterSection = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="text-gray-700 font-semibold mb-2">{title}</h4>
    {children}
  </div>
);

const RadioItem = ({ label, name, value, checked, onChange }) => (
  <label className="flex items-center mb-1 cursor-pointer">
    <input
      type="radio"
      name={name}
      value={value}               
      checked={checked}
      onChange={onChange}        
      className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="flex items-center mb-1 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

/* -------------------- Main Sidebar -------------------- */

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    size: [],
    color: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 5000,
  });

  const categories = ["Top Wear", "Bottom Wear"];
  const genders = ["Men", "Women"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXL+"];

  const colors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Pink",
    "Beige",
    "Navy",
    "Brown",
    "Grey",
    "Olive",
    "Maroon",
    "Lavender",
  ];

  const materials = [
    "Cotton",
    "Denim",
    "Leather",
    "Linen",
    "Silk",
    "Polyester",
    "Rayon",
    "Wool",
    "Velvet",
  ];

  const brands = [
    "Nike",
    "Adidas",
    "Zara",
    "H&M",
    "Puma",
    "Levi's",
    "Uniqlo",
    "Allen Solly",
  ];

  /* -------------------- Handlers -------------------- */

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;

    console.log({
      name,
      value,
      checked,
      type,
    });

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMulti = (type, value) => {
    console.log("Filter toggled:", type, value);

    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const clearAll = () => {
    console.log("Clearing all filters");

    setFilters({
      category: "",
      gender: "",
      size: [],
      color: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 5000,
    });

    setSearchParams({});
  };

  /* -------------------- Sync State → URL -------------------- */

useEffect(() => {
  const params = new URLSearchParams(searchParams); // ✅ CLONE existing (keeps sort)

  // Clear only filter-related params first
  [
    "category",
    "gender",
    "size",
    "color",
    "material",
    "brand",
    "maxPrice",
  ].forEach((key) => params.delete(key));

  // Re-apply filters
  if (filters.category) params.set("category", filters.category);
  if (filters.gender) params.set("gender", filters.gender);

  filters.size.forEach((v) => params.append("size", v));
  filters.color.forEach((v) => params.append("color", v));
  filters.material.forEach((v) => params.append("material", v));
  filters.brand.forEach((v) => params.append("brand", v));

  if (filters.maxPrice !== 5000) {
    params.set("maxPrice", filters.maxPrice);
  }

  setSearchParams(params);
}, [filters]);


  /* -------------------- UI -------------------- */

  return (
    <aside className="w-full bg-white border-r border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAll}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        {categories.map((c) => (
          <RadioItem
            key={c}
            label={c}
            name="category"
            value={c}                 
            checked={filters.category === c}
            onChange={handleFilterChange}   
          />
        ))}
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        {genders.map((g) => (
          <RadioItem
            key={g}
            label={g}
            name="gender"
            value={g}                 
            checked={filters.gender === g}
            onChange={handleFilterChange}   
          />
        ))}
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        {sizes.map((s) => (
          <CheckboxItem
            key={s}
            label={s}
            checked={filters.size.includes(s)}
            onChange={() => toggleMulti("size", s)}
          />
        ))}
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => toggleMulti("color", c)}
              className={`w-9 h-9 rounded-full border transition
                ${
                  filters.color.includes(c)
                    ? "ring-2 ring-blue-500 scale-110"
                    : "border-gray-300 hover:scale-105"
                }`}
              style={{ backgroundColor: c.toLowerCase() }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material">
        {materials.map((m) => (
          <CheckboxItem
            key={m}
            label={m}
            checked={filters.material.includes(m)}
            onChange={() => toggleMulti("material", m)}
          />
        ))}
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        {brands.map((b) => (
          <CheckboxItem
            key={b}
            label={b}
            checked={filters.brand.includes(b)}
            onChange={() => toggleMulti("brand", b)}
          />
        ))}
      </FilterSection>

      {/* Price */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Max Price: ₹{filters.maxPrice}
        </label>
        <input
          type="range"
          min={0}
          max={5000}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => {
            console.log({
              name: "maxPrice",
              value: e.target.value,
              type: "range",
            });
            setFilters((p) => ({
              ...p,
              maxPrice: Number(e.target.value),
            }));
          }}
          className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer"
        />
      </div>
    </aside>
  );
};
export default FilterSidebar;
