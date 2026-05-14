import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();
  // Ensure 'adminOrders' matches the key in store.js
  const { orders, loading, error } = useSelector((state) => state.adminOrders || { orders: [] });

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Error: {typeof error === 'object' ? error.message : error}
      </div>
    );
  }

  const orderList = Array.isArray(orders) ? orders : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders ({orderList.length})</h1>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="px-6 py-4 text-left w-1/4">Order ID</th>
              <th className="px-6 py-4 text-left w-1/4">Customer</th>
              <th className="px-6 py-4 text-left w-1/6">Total</th>
              <th className="px-6 py-4 text-left w-1/6">Status</th>
              <th className="px-6 py-4 text-left w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orderList.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order._id}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">{order.user?.name || "Guest"}</p>
                </td>
                <td className="px-6 py-4 font-medium">₹{order.totalPrice}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <select 
                    onChange={(e) => dispatch(updateOrderStatus({ id: order._id, status: e.target.value }))}
                    value={order.status}
                    className="bg-gray-50 border text-gray-900 text-xs text-center rounded-lg p-1"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;