import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import loginImg from "../assets/rabbit-assets-main/assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import { mergeCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  // FIXED: Logic only triggers if a full user object (with _id) exists
  useEffect(() => {
    if (user && user._id) {
      if (Array.isArray(cartItems) && cartItems.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, userId: user._id })).then(() => {
          navigate(redirect);
        });
      } else {
        navigate(redirect);
      }
    }
  }, [user, navigate, redirect, cartItems, guestId, dispatch]);

  // FIXED: handleSubmit is now properly defined inside the component
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
          <div className="flex justify-center mb-4">
            <h2 className="text-5xl font-mono font-bold">Rabbit🐰</h2>
          </div>
          <h2 className="text-center mb-3 font-semibold">Hop back into your account 👋</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition">
            Sign In
          </button>
          <p className="mt-6 text-sm text-center">
            Don't have an account?{" "}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500"> Register </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2">
        <img src={loginImg} alt="Login" className="h-screen w-full object-cover" />
      </div>
    </div>
  );
};

export default Login;