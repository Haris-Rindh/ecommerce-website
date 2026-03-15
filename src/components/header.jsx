import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    User,
    MessageSquare,
    Heart,
    ShoppingCart,
} from "lucide-react";

const Header = () => {
    // 2. Set up state for the inputs
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All Categories');
    
    // 3. Initialize the navigate function
    const navigate = useNavigate();

    // 4. Create the submit handler
    const handleSearch = (e) => {
        e.preventDefault(); // Stop the page from refreshing
        
        // Don't search if the box is empty
        if (searchQuery.trim() === '') return; 
        
        // Push the user to the search route with URL parameters
        navigate(`/search?q=${encodeURIComponent(searchQuery)}&cat=${encodeURIComponent(category)}`);
    };

    return (
        <header className=" w-full border-b border-gray-200 bg-white">
            <div className="flex w-full mx-auto max-w-[1440px] h-[86px] justify-between items-center px-6">

                <div className="flex items-center cursor-pointer gap-2">
                    <div className="flex justify-center items-center text-white bg-blue-500 rounded p-2 shadow-sm shadow-blue-200 gap-2">
                        <ShoppingBag size={24} />
                    </div>
                    <span className="font-bold text-2xl text-blue-500 tracking-tight">Brand</span>
                </div>

                <form 
                    onSubmit={handleSearch} 
                    className="flex flex-1 max-w-2xl mx-8 border-2 border-blue-500 rounded-lg overflow-hidden"
                >
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 focus:outline-none"
                    />

                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-2 border-l border-blue-300 text-gray-700 focus:outline-none cursor-pointer bg-white"
                    >
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Home & Garden</option>
                    </select>

                    <button 
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 focus:outline-none"
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-6 text-gray-500">
                    <ActionButton Icon={User} label="Account" />
                    <ActionButton Icon={MessageSquare} label="Messages" />
                    <ActionButton Icon={Heart} label="Wishlist" />
                    <ActionButton Icon={ShoppingCart} label="Cart" />
                </div>
            </div>
        </header>
    );
};

function ActionButton({ Icon, label }) {
    return (
        <button 
            className="flex flex-col items-center cursor-pointer gap-2 transition-colors duration-200 hover:text-blue-500 focus:outline-none"
        >
                <Icon size={20} />
                <span className="text-xs">{label}</span>
        </button>
    );
}

export default Header;
