import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Categoryproducts from "./pages/categoryProducts";
import Signup from "./pages/signUp";
import Login from "./pages/login";
import Profile from "./pages/profile";
import ProductDetail from "./pages/productDetail";
import Cart from "./pages/cart";
import Order from "./pages/orders";
import Checkout from "./pages/checkout";
import Product from "./pages/products";
import Header from "./components/header";
import Footer from "./components/footer";
import EditProfile from "./pages/editProfile";
import Auth from "./pages/auth";
import Wishlist from "./pages/wishList";

function AppContent() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/auth";

  return (
    <>
      {!hideLayout && (
        <div className="sticky top-0 z-50 bg-white ">
          <Header />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/productdetail/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products" element={<Product />} />
        <Route path="/categoryproducts/:id" element={<Categoryproducts />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>

      {!hideLayout &&
        <div>
          <Footer className="fixed bottom-0 z-50 bg-white" />
        </div>}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
