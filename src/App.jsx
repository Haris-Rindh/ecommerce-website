import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts (The Brain)
import { GlobalProvider } from "./context/GlobalState";
import { ToastProvider } from "./context/ToastContext";

// Layout Components
import Header from "./components/layout/header";
import Navbar from "./components/layout/navbar";
import Newsletter from "./components/layout/newsletter";
import Footer from "./components/layout/footer";

// Security Routes
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/Product/ProductDetails";
import Placeholder from "./pages/Placeholder";

// Auth Pages
import Login from "./pages/Auth/Login";

// Protected User Pages
import AddToCart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile/Profile";
import Saved from "./pages/Profile/Saved";
import Messages from "./pages/Profile/Messages";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SeedData from "./pages/Admin/SeedData";

const App = () => {
  return (
    <GlobalProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <Header />
            <Navbar />

            <div className="flex-grow">
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                
                {/* --- Placeholder Routes --- */}
                <Route path="/contact" element={<Placeholder />} />
                <Route path="/faq" element={<Placeholder />} />
                <Route path="/support" element={<Placeholder />} />

                {/* --- Protected User Routes --- */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <AddToCart />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/saved" element={
                  <ProtectedRoute>
                    <Saved />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />

                {/* --- Protected Admin Routes --- */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/seed" element={
                  <AdminRoute>
                    <SeedData />
                  </AdminRoute>
                } />

              </Routes>
            </div>

            <Newsletter />
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </GlobalProvider>
  );
};

export default App;