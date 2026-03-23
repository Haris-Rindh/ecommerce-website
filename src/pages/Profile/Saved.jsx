import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalState';
import { useToast } from '../../context/ToastContext';
import { ShoppingCart, Trash2, Heart, ChevronRight } from 'lucide-react';

const Saved = () => {
    const { saved, toggleSaved, addToCart } = useGlobalContext();
    const showToast = useToast();

    const handleMoveToCart = (product) => {
        addToCart({ ...product, qty: 1 });
        toggleSaved(product);
        showToast("Moved to cart successfully!", "success");
    };

    return (
        <div className="bg-gray-50 min-h-[70vh] py-8 font-sans">
            <div className="max-w-[1180px] mx-auto px-4">
                
                <div className='flex items-center gap-2 text-gray-500 text-sm mb-6'>
                    <Link to="/" className='hover:text-blue-600 transition-colors'>Home</Link>
                    <ChevronRight size={16} />
                    <Link to="/profile" className='hover:text-blue-600 transition-colors'>My Profile</Link>
                    <ChevronRight size={16} />
                    <span className='text-gray-900 font-medium'>Saved Items</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

                {saved.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Heart size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Save items you like and they will appear here.</p>
                        <Link to="/" className="bg-[#0D6EFD] text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {saved.map(item => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                <Link to={`/product/${item.id}`} className="w-full h-48 bg-gray-50 flex items-center justify-center p-4 group cursor-pointer">
                                    <img src={item.image || item.images?.[0]} alt={item.title} className="max-w-full max-h-full mix-blend-multiply group-hover:scale-105 transition-transform" />
                                </Link>
                                
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600">
                                        <Link to={`/product/${item.id}`}>{item.title}</Link>
                                    </h3>
                                    <div className="mt-auto">
                                        <span className="text-lg font-bold text-gray-900 block mb-4">${Number(item.price).toFixed(2)}</span>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleMoveToCart(item)}
                                                className="flex-1 bg-blue-50 text-blue-600 font-medium py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-colors text-sm border border-blue-100"
                                            >
                                                <ShoppingCart size={16} /> Move to Cart
                                            </button>
                                            <button 
                                                onClick={() => toggleSaved(item)}
                                                className="w-10 shrink-0 bg-blue-50 text-blue-500 rounded flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors border border-blue-100"
                                                title="Remove"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Saved;