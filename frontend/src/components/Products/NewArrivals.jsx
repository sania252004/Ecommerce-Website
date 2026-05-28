import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from "axios";

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(false); 
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
        
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
      const fetchNewArrivals = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
          
          // Debugging log so you can inspect exactly what production sends
          console.log("API Response Data:", response.data);

          // Defensive handling: check if response data is the array, or nested inside keys like 'products' or 'data'
          if (Array.isArray(response.data)) {
            setNewArrivals(response.data);
          } else if (response.data && Array.isArray(response.data.products)) {
            setNewArrivals(response.data.products);
          } else if (response.data && Array.isArray(response.data.data)) {
            setNewArrivals(response.data.data);
          } else {
            console.error("API did not return an array:", response.data);
            setNewArrivals([]); // Fallback to avoid crashes
          }

        } catch (error) {
          console.error("Failed to fetch new arrivals:", error);
          setNewArrivals([]); // Fallback on request failure
        }
      };
      fetchNewArrivals();
    }, []);

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = x - startX;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
      setIsDragging(false);
    };

    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons(); // Initial check
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [newArrivals]);

 return (
   <section className="px-4 lg:px-0 mb-20">
     <div className="container mx-auto text-center mb-10 relative">
       <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
       <p className="text-lg text-gray-600 mb-8">
         Discover the latest trends and styles, freshly added to keep your
         wardrobe on the cutting edge of fashion.
       </p>

       {/* Scroll Button */}
       <div className="absolute right-0 bottom-[-30px] flex space-x-2">
         <button
           onClick={() => scroll("left")}
           disabled={!canScrollLeft}
           className={`p-2 rounded border ${canScrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
         >
           <FiChevronLeft className="text-2xl" />
         </button>
         <button
           onClick={() => scroll("right")}
           disabled={!canScrollRight}
           className={`p-2 rounded border ${canScrollRight ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
         >
           <FiChevronRight className="text-2xl" />
         </button>
       </div>
     </div>

     {/* Scrollable Products Grid */}
     <div
       ref={scrollRef}
       className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
         isDragging ? "cursor-grabbing" : "cursor-grab"
       }`}
       onMouseDown={handleMouseDown}
       onMouseMove={handleMouseMove}
       onMouseUp={handleMouseUpOrLeave}
       onMouseLeave={handleMouseUpOrLeave}
     >
       {/* Safe Array Verification Before Mapping */}
       {Array.isArray(newArrivals) && newArrivals.length > 0 ? (
         newArrivals.map((product) => (
           <div
             key={product._id}
             className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
           >
             {product.images && product.images[0]?.url ? (
               <img
                 src={product.images[0].url}
                 alt={product.images[0].altText || product.name}
                 className="w-full h-[500px] object-cover"
                 draggable="false"
               />
             ) : (
               <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                 No Image Available
               </div>
             )}

             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
               <Link to={`/product/${product._id}`} className="block">
                 <h4 className="font-medium">{product.name}</h4>
                 <p className="mt-1">${product.price.toFixed(2)}</p>
               </Link>
             </div>
           </div>
         ))
       ) : (
         <div className="w-full text-center text-gray-500 py-10">
           No new arrivals found.
         </div>
       )}
     </div>
   </section>
 );
};

export default NewArrivals;