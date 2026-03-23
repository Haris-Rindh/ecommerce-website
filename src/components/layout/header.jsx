import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingBag,
  User,
  MessageSquare,
  Heart,
  ShoppingCart,
  LogOut,
  ChevronDown,
  Package,
  LayoutDashboard,
  Menu,
  Search,
  X,
  Home,
  List,
  Globe,
  Headphones,
  Building2
} from "lucide-react";
import { useGlobalContext } from "../../context/GlobalState";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const navigate = useNavigate();

  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { cart, saved, user, logoutUser } = useGlobalContext();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const savedCount = saved.length;

  const ADMIN_EMAIL = "qadriharis11@gmail.com";

  const getAvatarContent = () => {
    if (!user) return <User size={20} className="text-gray-500" />;
    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="User Avatar"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
        />
      );
    } else {
      const initials = user.displayName
        ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : user.email.charAt(0).toUpperCase();
      return (
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm md:text-lg">
          {initials}
        </div>
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&cat=${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    logoutUser();
    setIsAvatarOpen(false);
    navigate("/");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white z-50 relative font-sans">

      <div className="flex w-full mx-auto max-w-[1180px] h-auto md:h-[86px] justify-between items-center px-4 py-3 md:py-0">
        
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDrawerOpen(true)} className="md:hidden text-gray-700 hover:text-blue-500">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center cursor-pointer gap-2 hover:opacity-90 transition-opacity">
            <div className="flex justify-center items-center text-white bg-blue-500 rounded p-1.5 md:p-2 shadow-sm shadow-blue-200 gap-2">
              <ShoppingBag size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="font-bold text-xl md:text-2xl text-blue-500 tracking-tight">
              TrendTrove
            </span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-8 border-2 border-blue-500 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 focus:outline-none text-[15px]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border-l border-blue-300 text-gray-700 focus:outline-none cursor-pointer bg-white text-[15px]"
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Home & Garden</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 focus:outline-none text-[15px] font-medium">
            Search
          </button>
        </form>

        <div className="flex items-center gap-4 md:gap-6 text-gray-500">
          <Link to="/messages" className="hidden lg:flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
            <MessageSquare size={20} />
            <span className="text-xs">Messages</span>
          </Link>

          <Link to="/saved" className="hidden lg:flex relative flex-col items-center gap-1 hover:text-blue-500 transition-colors">
            <Heart size={20} />
            {savedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">{savedCount}</span>
            )}
            <span className="text-xs">Orders</span>
          </Link>

          <Link to="/cart" className="relative flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
            <ShoppingCart size={20} className="text-gray-700 md:text-gray-500" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">{cartCount}</span>
            )}
            <span className="hidden lg:block text-xs">Cart</span>
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setIsAvatarOpen(!isAvatarOpen)} className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                {getAvatarContent()}
                <span className="hidden lg:flex text-xs font-medium text-gray-800 items-center gap-1.5 truncate max-w-[80px]">
                  {user.displayName || "My Account"} <ChevronDown size={14} className={`transform ${isAvatarOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              {isAvatarOpen && (
                 <div className="absolute right-0 mt-3 w-56 md:w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden font-sans">
                  <div className="flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-100 flex flex-col">
                      <span className="font-semibold text-gray-900 truncate">
                        {user.displayName || "User"}
                      </span>
                      <span className="text-sm text-gray-500 truncate">
                        {user.email}
                      </span>
                    </div>
                    {user.email === ADMIN_EMAIL && (
                      <Link to="/admin" onClick={() => setIsAvatarOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard size={18} /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsAvatarOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                      <User size={18} /> My Profile
                    </Link>
                    <Link to="/saved" onClick={() => setIsAvatarOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Package size={18} /> Orders
                    </Link>
                    <Link to="/messages" onClick={() => setIsAvatarOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                      <MessageSquare size={18} /> Message center
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left w-full">
                      <LogOut size={18} /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
              <User size={20} className="text-gray-700 md:text-gray-500" />
              <span className="hidden lg:block text-xs">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      <div className="lg:hidden px-4 pb-3 pt-2">
        <form onSubmit={handleSearch} className="flex w-full border border-gray-300 rounded-md overflow-hidden bg-gray-50">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
          />
          <button type="submit" className="px-3 text-gray-500 hover:text-blue-500 flex items-center justify-center">
            <Search size={18} />
          </button>
        </form>
      </div>

      {isDrawerOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-transparent z-[60]" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] flex flex-col overflow-y-auto transform transition-transform duration-300">

            <div className="p-5 bg-gray-50 flex flex-col gap-3 relative">
              <button onClick={() => setIsDrawerOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                {user ? getAvatarContent() : <User size={24} className="text-gray-400" />}
              </div>
              <div className="text-[15px] font-medium text-gray-800">
                {user ? <span className="truncate block max-w-full">{user.displayName || user.email}</span> : <Link to="/login" onClick={() => setIsDrawerOpen(false)}>Sign in | Register</Link>}
              </div>
            </div>

            <div className="flex flex-col py-2 border-b border-gray-200 text-gray-600">
              <Link to="/" onClick={() => setIsDrawerOpen(false)} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50">
                <Home size={22} className="text-gray-400" /> <span className="text-[15px]">Home</span>
              </Link>
              <Link to="/category/all" onClick={() => setIsDrawerOpen(false)} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50">
                <List size={22} className="text-gray-400" /> <span className="text-[15px]">Categories</span>
              </Link>
              <Link to="/saved" onClick={() => setIsDrawerOpen(false)} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50">
                <Heart size={22} className="text-gray-400" /> <span className="text-[15px]">Favorites</span>
              </Link>
              <Link to="/cart" onClick={() => setIsDrawerOpen(false)} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50">
                <Package size={22} className="text-gray-400" /> <span className="text-[15px]">My orders</span>
              </Link>
            </div>

            <div className="flex flex-col py-2 border-b border-gray-200 text-gray-600">
              <button className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 w-full text-left">
                <Globe size={22} className="text-gray-400" /> <span className="text-[15px]">English | USD</span>
              </button>
              <button className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 w-full text-left">
                <Headphones size={22} className="text-gray-400" /> <span className="text-[15px]">Contact us</span>
              </button>
              <button className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 w-full text-left">
                <Building2 size={22} className="text-gray-400" /> <span className="text-[15px]">About</span>
              </button>
            </div>

            <div className="flex flex-col py-5 px-5 gap-5">
              <button className="text-[15px] text-gray-600 hover:text-gray-900 text-left">User agreement</button>
              <button className="text-[15px] text-gray-600 hover:text-gray-900 text-left">Partnership</button>
              <button className="text-[15px] text-gray-600 hover:text-gray-900 text-left">Privacy policy</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;