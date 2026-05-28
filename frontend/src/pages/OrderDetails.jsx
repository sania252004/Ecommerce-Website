import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // 1. Get state from Redux
  const { orders, orderDetails: reduxDetails, loading, error } = useSelector(
    (state) => state.orders || { orders: [] }
  );

  // 2. LOGIC: Find order locally if API hasn't loaded yet
  const orderDetails = reduxDetails || orders.find((o) => o._id === id);

  // 3. Helper function to check payment status across different naming conventions
  const checkIsPaid = (order) => {
    return (
      order?.isPaid === true || 
      order?.paymentInfo?.status === "succeeded" || 
      order?.paymentInfo?.status === "Paid" ||
      order?.status === "Paid"
    );
  };

  useEffect(() => {
    // Only fetch if we don't have it locally or if we want the freshest data
    if (id && !orderDetails) {
      dispatch(fetchOrderDetails(id));
    }
  }, [id, dispatch, orderDetails]);

  // Handle Loading State
  if (loading && !orderDetails) {
    return (
      <div className=" items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your order details...</p>
        </div>
      </div>
    );
  }

  // Handle Error or Not Found
  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto p-10 text-center bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 inline-block">
          <p className="text-gray-500 mb-4">We couldn't find order #{id}</p>
          <Link to="/my-orders" className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = checkIsPaid(orderDetails);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 ">
      <Link to="/my-orders" className="inline-flex items-center text-sm text-gray-500 hover:text-rose-600 mb-6 transition-colors">
        <span className="mr-2">←</span> Back to My Orders
      </Link>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Details</h1>
          <p className="text-gray-500 mt-1">
            Placed on {orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Recently"}
          </p>
        </div>
      <div className="flex gap-3">
          <button className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm">
            Invoice
          </button>
          <button className="px-5 py-2 bg-rose-500 text-white rounded-lg text-sm font-semibold hover:bg-rose-600 transition shadow-sm">
            Track Order
          </button>
        </div>
      </div>

      {/* TOP SUMMARY CARD (Status Badges) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Order Identifier</p>
          <p className="font-mono font-bold text-xl text-gray-800">#{orderDetails._id}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {/* PAYMENT STATUS */}
          <div className="flex flex-col items-center md:items-end">
             <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Payment</p>
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                isPaid 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                : "bg-amber-50 text-amber-700 border-amber-100"
              }`}>
              {isPaid ? "● Paid Successfully" : "○ Payment Pending"}
            </span>
          </div>

          {/* DELIVERY STATUS */}
          <div className="flex flex-col items-center md:items-end">
             <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Delivery</p>
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                orderDetails.isDelivered 
                ? "bg-blue-50 text-blue-700 border-blue-100" 
                : "bg-gray-50 text-gray-600 border-gray-100"
              }`}>
              {orderDetails.isDelivered ? "● Delivered" : "○ Processing"}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: PRODUCTS LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="p-6 font-bold text-gray-900 border-b border-gray-50">Items in your package</h3>
            <div className="divide-y divide-gray-50">
              {orderDetails.orderItems?.map((item) => (
                <div key={item.productId || item._id} className="p-6 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover border border-gray-100 bg-gray-50" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h4>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                       <p>Size: <span className="text-gray-900 font-medium">{item.size || 'M'}</span></p>
                       <p>Color: <span className="text-gray-900 font-medium">{item.color || 'Standard'}</span></p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Qty: <span className="text-gray-900 font-bold">{item.quantity || item.qty}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-gray-900">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: SHIPPING & SUMMARY */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
               <span className="mr-2">📍</span> Delivery Address
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="font-bold text-gray-800">Home</span><br />
              {orderDetails.shippingAddress?.address || "Address Line 1"}<br />
              {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.country}<br />
              Pin: {orderDetails.shippingAddress?.postalCode || "700001"}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
               <span className="mr-2">💳</span> Payment Method
            </h3>
            <div className="flex items-center justify-between text-sm">
               <span className="text-gray-500 font-medium capitalize">{orderDetails.paymentMethod || "Online Payment"}</span>
               <span className={isPaid ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                 {isPaid ? "Verified" : "Action Required"}
               </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ring-2 ring-rose-50">
            <h3 className="font-bold text-gray-900 mb-4">Total Amount</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Items Subtotal</span>
                <span>₹{orderDetails.totalPrice || 0}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-xl font-black text-gray-900">
                <span>Final Total</span>
                <span className="text-rose-600">₹{orderDetails.totalPrice || 0}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
