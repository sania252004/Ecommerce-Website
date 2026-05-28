import { CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";

const steps = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

const OrderConfirmation = () => {
  // Pull the order from state.orders (matching the slice name in store)
const order = useSelector((state) => state.orders?.order);
  if (!order) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold">Loading Order Details...</h2>
        <p className="text-gray-500">If this persists, the session may have expired.</p>
      </div>
    );
  }

  const currentStep = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

  const estimateDelivery = () => {
    const date = new Date(order.createdAt);
    date.setDate(date.getDate() + 10);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-10">
        Thank You for placing an Order!!! 🎉
      </h1>

      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
          <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-emerald-600 font-medium">Estimated Delivery</p>
          <p className="text-gray-700">{estimateDelivery()}</p>
        </div>
      </div>

      <div className="border rounded-xl p-6 mb-10">
        <h3 className="font-semibold mb-6 text-lg">Order Status</h3>
        <div className="relative ml-4">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isActive = index === currentStep;
            return (
              <div key={step} className="flex items-start mb-8 last:mb-0">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isCompleted ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-500"}`}>
                    {isCompleted ? <CheckCircle size={18} /> : index + 1}
                  </div>
                  {index !== steps.length - 1 && (
                    <div className={`absolute left-1/2 top-8 w-0.5 h-10 -translate-x-1/2 ${isCompleted ? "bg-emerald-600" : "bg-gray-300"}`} />
                  )}
                </div>
                <div className="ml-4">
                  <p className={`font-medium ${isActive ? "text-emerald-700" : isCompleted ? "text-gray-800" : "text-gray-400"}`}>{step}</p>
                  <p className="text-xs text-gray-400">{isCompleted ? "Completed" : "Pending"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border rounded-xl p-6 mb-10">
        <h3 className="font-semibold mb-4">Items in Your Order</h3>
        {order.orderItems?.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 mb-4 last:mb-0">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.color} | {item.size}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">₹{item.price}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Payment Information</h3>
          <p className="text-sm">Method: {order.paymentInfo?.method}</p>
          <p className="text-sm">Status: <span className="text-emerald-600">{order.paymentInfo?.status}</span></p>
          <p className="text-sm font-medium mt-2">Amount Paid: ₹{order.totalPrice}</p>
        </div>
        <div className="border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <p className="text-sm text-gray-600">
            {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
