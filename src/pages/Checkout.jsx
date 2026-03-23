
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalState';
import { useToast } from '../context/ToastContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Checkout = () => {
    const { cart, user, clearCart, isAuthLoading } = useGlobalContext();
    const navigate = useNavigate();
    const showToast = useToast();

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '', address: '', city: '', zipCode: '', country: 'US'
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = cart.reduce((acc, item) => acc + (item.currentPrice * item.qty), 0);
    const discount = subtotal > 500 ? 60 : 0;
    const tax = subtotal * 0.05;
    const total = subtotal - discount + tax;

    useEffect(() => {
        if (!isAuthLoading) {
            if (!user) {
                showToast("Please log in to checkout!");
                navigate('/login');
            } else if (cart.length === 0) {
                navigate('/cart');
            }
        }
    }, [user, cart, navigate, isAuthLoading]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const orderData = {
                userId: user.uid,
                userEmail: user.email,
                shippingInfo,
                items: cart,
                totalAmount: total,
                status: 'Processing',
                createdAt: serverTimestamp() 
            };

            const docRef = await addDoc(collection(db, "orders"), orderData);
            
            clearCart();
            setIsProcessing(false);
            showToast(`Order Placed Successfully! Order ID: ${docRef.id}`);
            navigate('/');

        } catch (error) {
            console.error("Error placing order:", error);
            showToast("There was an issue placing your order.");
            setIsProcessing(false);
        }
    };

    if (isAuthLoading || !user || cart.length === 0) return null; 

    return (
        <div className="bg-gray-50 py-10 min-h-screen font-sans">
            <div className="max-w-[1000px] mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-6 lg:gap-8 px-4">
                
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 h-fit">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Details</h2>
                    <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input required type="text" value={shippingInfo.fullName} onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input required type="text" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input required type="text" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                <input required type="text" value={shippingInfo.zipCode} onChange={e => setShippingInfo({...shippingInfo, zipCode: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none" />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                    
                    <div className="flex flex-col gap-3 mb-4 max-h-[300px] overflow-y-auto pr-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-3 items-center">
                                <img src={item.images?.[0] || item.image} alt={item.title} className="w-12 h-12 object-contain bg-gray-100 rounded" />
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</span>
                                    <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">${(item.currentPrice * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <hr className="my-4 border-gray-200" />
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Discount</span><span className="text-blue-500">-${discount.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-gray-600 mb-4"><span>Tax</span><span className="text-green-600">+${tax.toFixed(2)}</span></div>
                    
                    <div className="flex justify-between text-lg font-bold text-gray-900 mb-6"><span>Total</span><span>${total.toFixed(2)}</span></div>

                    <button form="checkout-form" disabled={isProcessing} className="w-full bg-[#00B517] text-white font-bold py-3 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400">
                        {isProcessing ? "Processing..." : "Place Order"}
                    </button>
                    <Link to="/cart" className="text-center text-sm text-blue-600 mt-4 hover:underline">Return to Cart</Link>
                </div>
            </div>
        </div>
    );
};

export default Checkout;