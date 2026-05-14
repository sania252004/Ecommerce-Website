import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import PayPalButton from "./PayPalButton";
import { setOrder } from "../../redux/slices/orderSlice";

const INR_TO_USD = 0.012;

const coupons = [
  {
    code: "SAVE10",
    type: "percent",
    value: 10,
    minOrder: 1000,
    description: "10% off on orders above ₹1000",
  },
  {
    code: "FLAT200",
    type: "flat",
    value: 200,
    minOrder: 1500,
    description: "Flat ₹200 off on orders above ₹1500",
  },
  {
    code: "RABBIT15",
    type: "percent",
    value: 15,
    minOrder: 2000,
    description: "15% off on orders above ₹2000",
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  const shipping = subtotal >= 1000 ? 0 : 40;
  const discountAmount = Math.min(discount, subtotal);
  const total = subtotal + shipping - discountAmount;
  const paypalAmountUSD = (total * INR_TO_USD).toFixed(2);

  const applyCoupon = (couponOrCode) => {
    let coupon =
      typeof couponOrCode === "string"
        ? coupons.find((c) => c.code === couponOrCode.toUpperCase())
        : couponOrCode;
    if (!coupon) { alert("Invalid coupon code"); return; }
    if (subtotal < coupon.minOrder) {
      alert(`Minimum order ₹${coupon.minOrder} required`);
      return;
    }
    let discountValue =
      coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;
    setDiscount(discountValue);
    setAppliedCoupon(coupon.code);
    setCouponCode(coupon.code);
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setAppliedCoupon(null);
  };

  // ✅ FIXED: Now saves order to database before navigating
  const handlePaymentSuccess = async (details) => {
    try {
      const token =
        JSON.parse(localStorage.getItem("userInfo"))?.token ||
        localStorage.getItem("userToken");

      // Save order to MongoDB
      const { data: savedOrder } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        {
          orderItems: cartItems.map((item) => ({
            productId: item.productId || item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
          shippingAddress,
          paymentMethod: "PayPal",
          totalPrice: total,
          isPaid: true,
          paidAt: new Date().toISOString(),
          paymentInfo: {
            transactionId: details.id,
            status: "Paid",
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Save to Redux for order confirmation page
      dispatch(setOrder(savedOrder));
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Order save failed:", error);
      alert("Payment was successful but order could not be saved. Please contact support.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

        {/* Contact Info */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email address</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, phone: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">First name</label>
              <input
                type="text"
                placeholder="First Name"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Street address</label>
              <input
                type="text"
                placeholder="House no, Street, Area"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, address: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Postal code</label>
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Country</label>
              <select
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, country: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
              >
               <option>India</option>

                <option>United States</option>

                <option>United Kingdom</option>

                <option>Australia</option>

                <option>Canada</option>

                <option>Germany</option>

                <option>France</option>

                <option>Italy</option>

                <option>Spain</option>

                <option>Netherlands</option>

                <option>Switzerland</option>

                <option>Sweden</option>

                <option>Norway</option>

                <option>Denmark</option>

                <option>Belgium</option>

                <option>Austria</option>

                <option>Portugal</option>

                <option>Ireland</option>

                <option>Finland</option>

                <option>Poland</option>

                <option>Czech Republic</option>

                <option>Hungary</option>

                <option>Greece</option>

                <option>Turkey</option>

                <option>United Arab Emirates</option>

                <option>Saudi Arabia</option>

                <option>Qatar</option>

                <option>Kuwait</option>

                <option>Singapore</option>

                <option>Malaysia</option>

                <option>Thailand</option>

                <option>Indonesia</option>

                <option>Philippines</option>

                <option>Vietnam</option>

                <option>Japan</option>

                <option>South Korea</option>

                <option>China</option>

                <option>Hong Kong</option>

                <option>Taiwan</option>

                <option>New Zealand</option>

                <option>South Africa</option>

                <option>Egypt</option>

                <option>Nigeria</option>

                <option>Kenya</option>

                <option>Brazil</option>

                <option>Argentina</option>

                <option>Chile</option>

                <option>Mexico</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
          <div className="border rounded-xl bg-white shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <input type="radio" checked readOnly className="accent-black" />
              <span className="font-medium">PayPal</span>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <PayPalButton
                  amount={paypalAmountUSD}
                  currency="USD"
                  onSuccess={handlePaymentSuccess}
                  onError={() => alert("Payment failed. Try again.")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className="bg-white p-6 rounded-xl shadow h-fit">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {Array.isArray(cartItems) ? (
          cartItems.map((item, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Size: {item.size} | Color: {item.color}
                </p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">₹{item.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items in cart</p>
        )}

        {/* Coupons */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Available Coupons</h4>
          {coupons.map((c) => {
            const disabled = subtotal < c.minOrder;
            const active = appliedCoupon === c.code;
            return (
              <div
                key={c.code}
                onClick={() => !disabled && applyCoupon(c)}
                className={`border rounded-lg p-3 mb-2 cursor-pointer ${
                  active
                    ? "border-green-600 bg-green-50"
                    : disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-black"
                }`}
              >
                <div className="flex justify-between">
                  <strong>{c.code}</strong>
                  <span>
                    {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{c.description}</p>
                {disabled && (
                  <p className="text-xs text-red-500 mt-1">
                    Add ₹{c.minOrder - subtotal} more to apply
                  </p>
                )}
              </div>
            );
          })}
          {appliedCoupon && (
            <div className="flex justify-between bg-green-100 p-3 rounded mt-3">
              <span className="text-green-700">Coupon {appliedCoupon} applied</span>
              <button onClick={removeCoupon} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="border-t pt-4 mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {subtotal >= 1000 && (
            <p className="text-xs text-green-600 mt-1">
              🎉 You've qualified for FREE shipping
            </p>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-green-600" : ""}>
              {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 