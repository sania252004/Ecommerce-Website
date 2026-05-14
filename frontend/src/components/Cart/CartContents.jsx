import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (product, delta) => {
    const newQuantity = product.quantity + delta;
    if (newQuantity >= 1) {
      dispatch(updateCartQuantity({
        productId: product.productId,
        quantity: newQuantity,
        guestId,
        userId,
        size: product.size,
        color: product.color,
      }));
    }
  };

  if (!cart?.products || cart.products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div>
      {cart.products.map((product, index) => (
        <div key={`${product.productId}-${index}`} className="flex items-start justify-between py-4 border-b">
          <div className="flex items-center space-x-4">
            <img 
              src={product.image || product.productId?.image} 
              alt={product.name} 
              className="w-16 h-16 object-cover rounded" 
            />
            <div>
              <h3 className="text-sm font-semibold">{product.name}</h3>
              <p className="text-xs text-gray-500">Size: {product.size} | Color: {product.color}</p>
              <div className="text-sm font-semibold mt-1 flex items-center">
                ₹{product.price}
                <button onClick={() => dispatch(removeFromCart({ 
                    productId: product.productId, 
                    size: product.size, 
                    color: product.color, 
                    userId,
                    guestId
                    }))}>
                  <RiDeleteBin3Line className="inline ml-4 text-red-600" />
                </button>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <button 
                  onClick={() => handleQtyChange(product, -1)} 
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50" 
                  disabled={product.quantity <= 1}
                >
                  −
                </button>
                <span className="text-sm font-medium">{product.quantity}</span>
                <button 
                  onClick={() => handleQtyChange(product, 1)} 
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;