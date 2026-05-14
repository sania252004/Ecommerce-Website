import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { logout } from "../../redux/slices/authSlice"; 

import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineCog,
  HiOutlineArrowLeft,
} from "react-icons/hi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear Redux State 
    // This ensures ProtectedRoutes sees user as 'null' and redirects to /login
    dispatch(logout()); 

    // 2. Clear LocalStorage
    localStorage.removeItem("adminAuth"); 
    localStorage.removeItem("userToken"); // Clear any other tokens if they exist

    // 3. Navigate to login
    // Using replace: true prevents the user from clicking 'back' into the admin panel
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full z-40">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-4xl font-extrabold">Rabbit 🐰</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <AdminLink to="/admin" icon={<HiOutlineHome />}>
            Dashboard
          </AdminLink>
          <AdminLink to="/admin/orders" icon={<HiOutlineClipboardList />}>
            Orders
          </AdminLink>
          <AdminLink to="/admin/products" icon={<HiOutlineShoppingBag />}>
            Products
          </AdminLink>
          <AdminLink to="/admin/users" icon={<HiOutlineUsers />}>
            Users
          </AdminLink>
          <AdminLink to="/admin/settings" icon={<HiOutlineCog />}>
            Settings
          </AdminLink>
        </nav>
        
        {/* SHOP NOW / BACK TO STORE */}
        <div className="p-4 border-t">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg
            text-sm font-medium text-gray-700
            hover:bg-gray-100 transition"
          >
            <span className="text-xl">
              <HiOutlineArrowLeft />
            </span>
            Shop Now
          </Link>
        </div>
      </aside>

      {/* MAIN AREA - Added ml-64 to account for fixed sidebar */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-50">
          <h2 className="text-lg font-semibold">Admin Panel</h2> 
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <img
              src="https://i.pravatar.cc/40"
              alt="Admin"
              className="w-9 h-9 rounded-full border"
            />
            <button
              type="button" // Explicitly type as button to prevent form triggers
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-full border bg-red-400 text-white hover:bg-red-500 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Sub-component for Sidebar Links
const AdminLink = ({ to, icon, children }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      {children}
    </NavLink>
  );
};

export default AdminLayout;