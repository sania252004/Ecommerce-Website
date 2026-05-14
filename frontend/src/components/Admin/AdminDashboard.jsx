import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
  HiOutlineShoppingBag,
} from "react-icons/hi";
// Path updated to singular "adminOrderSlice" to match your file explorer
import { fetchAdminOrders } from "../../redux/slices/adminOrderSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // FIX: Separate selector to prevent "Selector unknown" warning
  const adminOrdersData = useSelector((state) => state.adminOrders);
  const orders = adminOrdersData?.orders || [];
  const loading = adminOrdersData?.loading || false;

  const productsCount = 128; // Replace with actual product slice data later
  const usersCount = 540;

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  // FIX: Define recentOrders safely
  const recentOrders = orders.length > 0 ? orders.slice(0, 5) : [];

  // FIX: Memoize totalRevenue for better performance
  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.isPaid)
      .reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  }, [orders]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={loading ? "..." : orders.length}
          icon={<HiOutlineClipboardList />}
        />
        <StatCard
          title="Total Revenue"
          value={loading ? "..." : `₹${totalRevenue.toLocaleString()}`}
          icon={<HiOutlineCurrencyRupee />}
        />
        <StatCard title="Users" value={usersCount} icon={<HiOutlineUsers />} />
        <StatCard title="Products" value={productsCount} icon={<HiOutlineShoppingBag />} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm font-medium text-gray-600 hover:text-black">
            View all
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">Loading orders...</td>
                </tr>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-xs">
                        #{order._id.toString().substring(0, 10)}
                    </td>
                    <td className="px-6 py-4">{order.user?.name || "Guest"}</td>
                    <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold">₹{order.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-full text-xs font-medium ${
                        order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-component for the cards
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="p-3 rounded-xl bg-gray-100 text-gray-700 text-2xl">
        {icon}
      </div>
    </div>
  </div>
);

export default AdminDashboard;