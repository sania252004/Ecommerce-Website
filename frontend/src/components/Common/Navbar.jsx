import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { HiOutlineShoppingBag, HiOutlineUser, HiBars3BottomRight } from 'react-icons/hi2';
import { IoMdClose } from 'react-icons/io';
import Searchbar from './Searchbar';
import CartDrawer from '../Layout/CartDrawer';
import { useSelector } from 'react-redux';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  
  const navigate = useNavigate(); // Hook for redirection
  const { user } = useSelector((state) => state.auth); // Check if user is logged in
  const { cartItems } = useSelector((state) => state.cart);

  // Safety check for .reduce to prevent crashes
  const totalItems = Array.isArray(cartItems) 
    ? cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0) 
    : 0;

  const toggleNavDrawer = () => setNavDropdownOpen(prev => !prev);

  // Logic: Redirect guest to login, or open drawer for logged-in users
  const toggleCartDrawer = () => {
    if (!user) {
      navigate("/login"); // Redirect guest users
    } else {
      setDrawerOpen(prev => !prev); // Open cart for logged-in users
    }
  };

  return (
    <>
      <nav className="w-full relative z-40 bg-white border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-extrabold flex-shrink-0">
              Rabbit
            </Link>

            {/* Right-Aligned Group: Menu + Icons */}
            <div className="flex flex-1 items-center justify-end gap-6 lg:gap-10">
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6 absolute left-[45%] -translate-x-1/2">
                <Link to="/collections/all?gender=Men" className="hover:text-black text-gray-600 font-medium text-sm uppercase">Men</Link>
                <Link to="/collections/all?gender=Women" className="hover:text-black text-gray-600 font-medium text-sm uppercase">Women</Link>
                <Link to="/collections/all?category=Top Wear" className="hover:text-black text-gray-600 font-medium text-sm uppercase">Top Wear</Link>
                <Link to="/collections/all?category=Bottom Wear" className="hover:text-black text-gray-600 font-medium text-sm uppercase">Bottom Wear</Link>
              </div>

              {/* Action Icons & Search */}
              <div className="flex items-center space-x-4">
                {user && user.role === 'admin' && (
                  <Link to="/admin" className="hidden md:block bg-black text-white px-4 py-1.5 rounded-sm text-sm font-medium hover:bg-gray-800 transition">
                  Admin
                </Link>
                )}                  
                <Link to="/profile" className="hover:text-black">
                  <HiOutlineUser className="h-6 w-6 text-gray-700" />
                </Link>
                
                <button onClick={toggleCartDrawer} className="relative hover:text-black">
                  <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full px-1.5 py-0.5">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Fixed Searchbar */}
                <div className="hidden sm:block">
                  <Searchbar />
                </div>

                {/* Mobile Hamburger */}
                <button onClick={toggleNavDrawer} className="md:hidden">
                  <HiBars3BottomRight className="h-7 w-7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${navDropdownOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}><IoMdClose className="h-6 w-6" /></button>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>
          <nav className="flex flex-col space-y-4">
            <Link to="/collections/all?gender=Men" onClick={toggleNavDrawer} className="text-gray-700 hover:text-black text-sm font-bold">Men</Link>
            <Link to="/collections/all?gender=Women" onClick={toggleNavDrawer} className="text-gray-700 hover:text-black text-sm font-bold">Women</Link>
            <Link to="/collections/all?category=Top Wear" onClick={toggleNavDrawer} className="text-gray-700 hover:text-black text-sm font-bold">Top Wear</Link>
            <Link to="/collections/all?category=Bottom Wear" onClick={toggleNavDrawer} className="text-gray-700 hover:text-black text-sm font-bold">Bottom Wear</Link>
          </nav>
        </div>
      </div>
    </>
  ); 
}

export default Navbar;