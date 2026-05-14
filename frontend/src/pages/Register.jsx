import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import register from "../assets/rabbit-assets-main/assets/register.webp";
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from 'react-redux';


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {user, guestId} = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Redirect if already logged in
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId){
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? checkout : "/");
        });
      } else{
         navigate(isCheckoutRedirect ? checkout : "/");
      }
    }
  }, [user, navigate, isCheckoutRedirect, cart, guestId, dispatch]);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({name,email,password}))
  };
  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
          <div className="flex justify-center mb-4">
            <h2 className="text-5xl font-mono font-bold text-center">Rabbit</h2>
          </div>
          <h2 className="text-s font-semibold text-center mb-3">
            Join us today — your journey starts here 🚀
          </h2>
          <p className="text-center mb-6">
            Enter your username and password to Sign Up.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800
          transition"
          >
            Sign Up
          </button>
          <p className="mt-6 text-sm text-center">
            Already have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500"> Login </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
      <div className="h-full flex flex-col justify-center items-center">
        <img src={register} alt="Login to Account" className="h-[750px] w-full object-cover"/>
      </div>
      </div>
    </div>
  );
};
export default Register; 
