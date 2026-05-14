import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Collection from "./pages/Collection";
import Productdetails from "./components/Products/Productdetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetails from "./pages/OrderDetails";
import MyOrder from "./pages/MyOrder";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminProduct from "./components/Admin/AdminProduct";
import AdminOrderDetails from "./components/Admin/AdminOrderDetails";
import AdminProductForm from "./components/Admin/AdminProductForm";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminSettings from "./components/Admin/AdminSettings";
import ProtectedRoutes from "./components/Common/ProtectedRoutes";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="collections/:collection" element={<Collection />} />
            <Route path="product/:id" element={<Productdetails />} />

            {/* PROTECTED USER ROUTES - Only accessible if logged in */}
            <Route element={<ProtectedRoutes />}>
              <Route path="profile" element={<Profile />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="/order-confirmation"element={<OrderConfirmation />}/>
              <Route path="order/:id" element={<OrderDetails />} />
              <Route path="my-orders" element={<MyOrder />} />
            </Route>
          </Route>

          {/* ADMIN ROUTES - Only accessible if logged in AND role is admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoutes role="admin">
                <AdminLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />
            <Route path="productform" element={<AdminProductForm />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;