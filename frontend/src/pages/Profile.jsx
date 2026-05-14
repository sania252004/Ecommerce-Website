import { useSelector, useDispatch } from "react-redux";
import MyOrder from "./MyOrder";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect to login if user is null
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // FIXED: handleLogout is now correctly defined inside the component scope
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    // Using window.location to force a clean app state
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left Section */}
          <div className="w-md md:w-1/3 lg:w-1/4 rounded-lg p-6 bg-white">
            <h1 className="text-xl md:text-2xl font-serif mb-4">
              Welcome, {user?.name || "User"}!
            </h1>
            <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;