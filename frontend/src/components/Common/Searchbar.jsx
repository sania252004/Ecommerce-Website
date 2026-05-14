import React, { useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilters, fetchProductsByFilters } from '../../redux/slices/productSlice';

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setFilters({ search: searchTerm }));
      dispatch(fetchProductsByFilters({ search: searchTerm }));
      navigate(`/collections/all?search=${searchTerm}`);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        {/* The Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
        </div>

        {/* The Input Field */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm 
                     border border-transparent focus:border-gray-300 focus:bg-white 
                     focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
        />
      </form>
    </div>
  );
};

export default Searchbar;