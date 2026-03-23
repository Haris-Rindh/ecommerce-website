import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useGlobalContext } from '../../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ShieldCheck, Truck, MessageSquare, ArrowLeft, User } from 'lucide-react';
import Rating from '@mui/material/Rating';
import { useToast } from '../../context/ToastContext';

const ProductPage = ({ id }) => {
    const { user, addToCart, saved, toggleSaved } = useGlobalContext();
    const navigate = useNavigate();
    const showToast = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [qty, setQty] = useState(1);
    
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="py-20 text-center font-medium text-gray-500 bg-white rounded-lg border border-gray-200 mb-6 shadow-sm">Loading product details...</div>;
    if (!product) return <div className="py-20 text-center font-medium text-gray-500 bg-white rounded-lg border border-gray-200 mb-6 shadow-sm">Product not found.</div>;

    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const isSaved = saved?.some(item => item.id === product.id);

    const handleAddToCart = () => {
        if (!user) {
            showToast("Please log in to add items to your cart.", "error");
            navigate('/login');
            return;
        }
        addToCart({ ...product, qty });
        showToast("Success! Item added to your cart.", "success");
    };

    const handleSave = () => {
        if (!user) {
            showToast("Please log in to save items.", "error");
            navigate('/login');
            return;
        }
        
        toggleSaved(product);
        if (isSaved) {
            showToast("Removed from wishlist.", "info");
        } else {
            showToast("Added to wishlist!", "success");
        }
    };
        const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const dist = touchStart - touchEnd;
        if (dist > 50 && activeIndex < images.length - 1) setActiveIndex(prev => prev + 1);
        if (dist < -50 && activeIndex > 0) setActiveIndex(prev => prev - 1);
    };

    return (
        <div className="bg-white md:border border-gray-200 md:rounded-lg p-0 md:p-4 mb-6 md:shadow-sm font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[380px_1fr_280px] gap-6">
                
                <div className="flex flex-col relative w-full overflow-hidden">
                    <div className="w-full h-[300px] md:h-[380px] md:border border-gray-400 md:border-gray-200 md:rounded-lg p-4 flex items-center justify-center bg-white relative border-b border-gray-200">
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center md:hidden z-10">
                            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 shadow-sm hover:bg-gray-50"><ArrowLeft size={20} /></button>
                            <div className="flex gap-2">
                                <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 shadow-sm hover:bg-gray-50"><ShoppingCart size={20} /></button>
                                <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-800 shadow-sm hover:bg-gray-50"><User size={20} /></button>
                            </div>
                        </div>

                        <img 
                            src={images[activeIndex]} 
                            alt={product.title} 
                            className="max-w-full max-h-full object-contain mix-blend-multiply cursor-pointer" 
                            onTouchStart={onTouchStart} 
                            onTouchMove={onTouchMove} 
                            onTouchEnd={onTouchEnd} 
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex flex-row gap-3 mt-4 overflow-x-auto no-scrollbar pb-2">
                            {images.map((img, index) => (
                                <button key={index} onClick={() => setActiveIndex(index)} className={`w-14 h-14 shrink-0 border rounded p-1 shadow-sm overflow-hidden transition-colors ${activeIndex === index ? 'border-blue-500 border-2' : 'border-gray-200 hover:border-gray-400'}`}>
                                    <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-contain mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col px-4 md:px-0">
                    {product.condition && <span className="text-green-600 font-semibold text-sm mb-1 mt-2 md:mt-0">✓ {product.condition}</span>}
                    <h1 className="text-[18px] md:text-2xl font-bold text-gray-900 leading-tight mb-2">{product.title}</h1>
                    
                    <div className="flex items-center gap-2 md:gap-4 text-[13px] md:text-sm mb-4">
                        <div className="flex items-center gap-1">
                            <Rating value={Number(product.rating || 0)} precision={0.1} readOnly size="small" sx={{ color: '#FF9017' }} />
                            <span className="text-orange-500 font-bold">{product.rating || "0.0"}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 flex items-center gap-1"><MessageSquare size={14}/> {product.reviewCount || 0} reviews</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 flex items-center gap-1"><ShoppingCart size={14}/> 154 sold</span>
                    </div>

                    <div className="md:bg-[#FFF0E5] md:px-4 py-2 md:py-3 md:rounded-md flex items-center gap-4 mb-6 bg-red-50 px-3 rounded text-red-600 md:text-gray-900 w-fit md:w-auto">
                        <div className="flex flex-col">
                            <span className="text-red-600 font-bold text-[20px] md:text-xl">${Number(product.discountedPrice || product.price).toFixed(2)}</span>
                        </div>
                        {product.discountedPrice && (
                            <div className="border-l border-red-200 md:border-orange-200 pl-4">
                                <span className="text-gray-500 text-sm line-through">${Number(product.price).toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-y-3 text-[14px] md:text-sm border-b border-gray-200 pb-6 mb-2 md:mb-6">
                        <span className="text-gray-500">Category:</span>
                        <span className="text-gray-800 font-medium capitalize">{product.categorySlug?.replace('-', ' ')}</span>
                        
                        <span className="text-gray-500">Brand:</span>
                        <span className="text-gray-800 font-medium">{product.brand || "Generic"}</span>
                        
                        <span className="text-gray-500">Features:</span>
                        <span className="text-gray-800">
                            {product.features && product.features.length > 0 ? product.features.join(' • ') : "Standard specifications"}
                        </span>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5 shadow-sm h-fit mx-4 md:mx-0 md:col-span-2 lg:col-span-1 flex flex-col lg:flex-col lg:justify-start">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 bg-[#C6F0D2] text-green-700 rounded flex items-center justify-center font-bold">
                            {product.brand ? product.brand.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">Verified Seller</span>
                            <span className="text-xs text-gray-500">98% Positive Feedback</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <ShieldCheck size={18} className="text-green-600"/> Buyer Protection guarantees
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between border border-gray-300 rounded-md overflow-hidden bg-white">
                            <button onClick={() => setQty(prev => prev > 1 ? prev - 1 : 1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold transition-colors">-</button>
                            <span className="font-medium text-gray-900">{qty}</span>
                            <button onClick={() => setQty(prev => prev + 1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold transition-colors">+</button>
                        </div>
                        
                        <button onClick={handleAddToCart} className="w-full bg-[#0D6EFD] text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2">
                            <ShoppingCart size={18} /> Add to Cart
                        </button>
                        
                        <button onClick={handleSave} className={`w-full font-medium py-2.5 rounded-md transition-colors shadow-sm flex justify-center items-center gap-2 border ${isSaved ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-white text-blue-600 border-gray-300 hover:bg-gray-50'}`}>
                            <Heart size={18} fill={isSaved ? "currentColor" : "none"} /> 
                            {isSaved ? "Saved" : "Save for later"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductPage;