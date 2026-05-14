import { useParams, Link } from "react-router-dom";

const orders = [
  {
    id: "ORD123",
    customer: "Aarav Sharma",
    date: "05 Jan 2026",
    status: "Paid",
    paymentMethod: "PayPal",
    shipping: "Kolkata, India",
    total: 2499,
    items: [
      { name: "Jacket", qty: 1, price: 1299 },
      { name: "T-Shirt", qty: 2, price: 600 },
    ],
  },
  {
    id: "ORD124",
    customer: "Neha Verma",
    date: "06 Jan 2026",
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    shipping: "Delhi, India",
    total: 1299,
    items: [{ name: "Denim Jeans", qty: 1, price: 1299 }],
  },
  {
    id: "ORD125",
    customer: "Rohan Das",
    date: "07 Jan 2026",
    status: "Paid",
    paymentMethod: "Card",
    shipping: "Mumbai, India",
    total: 3200,
    items: [
      { name: "Hoodie", qty: 1, price: 1800 },
      { name: "Joggers", qty: 1, price: 1400 },
    ],
  },
];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return <p className="text-gray-600">Order not found</p>;
  }

  return (
    <div>
      {/* BACK */}
      <Link
        to="/admin/orders"
        className="text-sm text-gray-600 hover:underline mb-4 inline-block"
      >
        ← Back to Orders
      </Link>

      <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>

      {/* ORDER SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-2">Customer</h3>
          <p>{order.customer}</p>
          <p className="text-sm text-gray-500">{order.shipping}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-2">Payment</h3>
          <p>{order.paymentMethod}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
              ${
                order.status === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {order.status}
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-2">Order Info</h3>
          <p>Date: {order.date}</p>
          <p>Total: ₹{order.total}</p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-center">Qty</th>
              <th className="px-6 py-4 text-center">Price</th>
              <th className="px-6 py-4 text-center">Subtotal</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4 text-center">{item.qty}</td>
                <td className="px-6 py-4 text-center">₹{item.price}</td>
                <td className="px-6 py-4 text-center">
                  ₹{item.qty * item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
