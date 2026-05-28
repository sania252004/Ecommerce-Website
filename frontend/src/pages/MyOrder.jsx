import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const MyOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Pulling real orders from Redux state
  const reduxOrders = useSelector((state) => state.orders?.orders || []);
  const { user } = useSelector((state) => state.auth || {});

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (reduxOrders) {
      setOrders(reduxOrders);
    }
  }, [reduxOrders]);

  const handleRowClick = (orderId) => {
    if (orderId) navigate(`/order/${orderId}`);
  };

  return (
    <div className="flex-1 w-full px-4 md:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500">Image</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500">Order ID</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500">Shipping</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500">Items</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 text-center">Qty</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500">Total</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-500 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center text-gray-400 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  // Added safety check for orderItems
                  const totalQty = order.orderItems?.reduce(
                    (sum, item) => sum + (item.qty || item.quantity || 0),
                    0
                  ) || 0;

                  return (
                    <tr
                      key={order._id || Math.random()} 
                      onClick={() => handleRowClick(order._id)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-4">
                        <img
                          src={order.orderItems?.[0]?.image || "/placeholder-image.png"}
                          alt="product"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm"
                        />
                      </td>
                      <td className="px-4 py-4 text-[13px] font-mono text-gray-500">
                        {/* FIX: Added ?. before slice to prevent the crash */}
                        #{order._id?.slice(-8).toUpperCase() || "UNKNOWN"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-GB")
                          : "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <span className="block font-medium text-gray-800">
                          {order.shippingAddress?.city || "N/A"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {order.shippingAddress?.country || ""}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <p className="truncate max-w-[140px] text-xs">
                          {order.orderItems?.[0]?.name || "No items"}
                          {order.orderItems?.length > 1 && (
                            <span className="text-blue-500 font-medium text-[10px] ml-1">
                              +{order.orderItems.length - 1} more
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-center font-medium text-gray-600">
                        {totalQty}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-900">
                        {/* Added ?. safety for toLocaleString */}
                        ₹{order.totalPrice?.toLocaleString() || "0"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {order.isPaid || order.paymentInfo?.status === "Paid" ? (
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-emerald-100">
                            Paid
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-100">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
