import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { AddressProvider } from "./context/AddressContext";
import { OrderProvider } from "./context/OrderContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Collections from "./pages/Collections";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import CustomFurniture from "./pages/CustomFurniture";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Orders from "./pages/account/Orders";
import OrderDetails from "./pages/account/OrderDetails";
import Addresses from "./pages/account/Addresses";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AddressProvider>
              <OrderProvider>
                <BrowserRouter>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/collections" element={<Collections />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/order-success/:id" element={<OrderSuccess />} />
                      <Route path="/custom-furniture" element={<CustomFurniture />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />

                      <Route
                        path="/account"
                        element={
                          <ProtectedRoute>
                            <AccountLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<Profile />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="orders/:id" element={<OrderDetails />} />
                        <Route path="addresses" element={<Addresses />} />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </OrderProvider>
            </AddressProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
