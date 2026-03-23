import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, addDoc, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useGlobalContext } from '../../context/GlobalState';
import { useToast } from '../../context/ToastContext';
import { Check, Truck, ShieldCheck, Clock, Store, User } from 'lucide-react';
import Rating from '@mui/material/Rating';

const DetailsTab = ({ productId }) => {
    const { user } = useGlobalContext();
    const showToast = useToast();
    
    const [activeTab, setActiveTab] = useState('description');
    const [sidebarProducts, setSidebarProducts] = useState([]);
    
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);

    useEffect(() => {
        const fetchSidebarProducts = async () => {
            try {
                const q = query(collection(db, "products"), limit(5));
                const snap = await getDocs(q);
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSidebarProducts(data.filter(p => p.id !== productId).slice(0, 5));
            } catch (error) {
                console.error("Error fetching sidebar products:", error);
            }
        };
        fetchSidebarProducts();
    }, [productId]);

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const q = query(collection(db, "reviews"), where("productId", "==", productId));
                const snap = await getDocs(q);
                const fetchedReviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
                fetchedReviews.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setIsLoadingReviews(false);
            }
        };
        if (productId) fetchReviews();
    }, [productId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            return showToast("You must be logged in to leave a review.", "error");
        }
        if (!newComment.trim()) {
            return showToast("Please write a comment for your review.", "error");
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                productId,
                userId: user.uid,
                userName: user.displayName || "Anonymous Buyer",
                userImage: user.photoURL || null,
                rating: newRating,
                comment: newComment,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, "reviews"), reviewData);
            
            setReviews([{ id: docRef.id, ...reviewData, createdAt: { seconds: Date.now() / 1000 } }, ...reviews]);
            setNewComment('');
            setNewRating(5);
            showToast("Review submitted successfully!", "success");
            
        } catch (error) {
            console.error(error);
            showToast("Failed to submit review.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 mt-6 font-sans">
            
            <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-fit">
                <div className="flex border-b border-gray-200 px-4 overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveTab('description')} className={`py-4 px-6 font-medium text-[15px] border-b-2 whitespace-nowrap transition-colors ${activeTab === 'description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Description</button>
                    <button onClick={() => setActiveTab('reviews')} className={`py-4 px-6 font-medium text-[15px] border-b-2 whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Reviews ({reviews.length})</button>
                    <button onClick={() => setActiveTab('shipping')} className={`py-4 px-6 font-medium text-[15px] border-b-2 whitespace-nowrap transition-colors ${activeTab === 'shipping' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Shipping & Returns</button>
                    <button onClick={() => setActiveTab('about')} className={`py-4 px-6 font-medium text-[15px] border-b-2 whitespace-nowrap transition-colors ${activeTab === 'about' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>About Seller</button>
                </div>

                <div className="p-6 text-gray-600 text-[15px] leading-relaxed">
                    
                    {activeTab === 'description' && (
                        <div className="flex flex-col gap-4 animate-fade-in">
                            <p>This product features premium build quality and exceptional design, tailored to meet standard industry requirements. Perfect for everyday use with high reliability.</p>
                            <ul className="flex flex-col gap-3 mt-2">
                                <li className="flex items-center gap-3"><Check size={18} className="text-blue-500"/> Durable and lightweight materials</li>
                                <li className="flex items-center gap-3"><Check size={18} className="text-blue-500"/> Modern, sleek aesthetic designed for comfort</li>
                                <li className="flex items-center gap-3"><Check size={18} className="text-blue-500"/> Easy to maintain and clean</li>
                                <li className="flex items-center gap-3"><Check size={18} className="text-blue-500"/> Backed by verified seller guarantee</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="flex flex-col gap-8 animate-fade-in">
                            
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-3">Write a Review</h3>
                                <form onSubmit={handleSubmitReview} className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                                        <Rating 
                                            value={newRating} 
                                            onChange={(event, newValue) => setNewRating(newValue)} 
                                            size="medium" 
                                            sx={{ color: '#FF9017' }} 
                                        />
                                    </div>
                                    <textarea 
                                        required
                                        placeholder="What did you think about this product?" 
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-24"
                                    ></textarea>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-fit px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                    >
                                        {isSubmitting ? "Posting..." : "Submit Review"}
                                    </button>
                                </form>
                            </div>

                            <div className="flex flex-col gap-6">
                                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Customer Reviews</h3>
                                
                                {isLoadingReviews ? (
                                    <p className="text-center text-gray-400 py-4">Loading reviews...</p>
                                ) : reviews.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this product!</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0">
                                            <div className="w-10 h-10 shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                                                {review.userImage ? (
                                                    <img src={review.userImage} alt={review.userName} className="w-full h-full object-cover" />
                                                ) : (
                                                    review.userName.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-gray-900">{review.userName}</span>
                                                    <span className="text-xs text-gray-400">
                                                        {review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                                    </span>
                                                </div>
                                                <Rating value={review.rating} readOnly size="small" sx={{ color: '#FF9017', mb: 1 }} />
                                                <p className="text-gray-700 text-sm">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="flex flex-col gap-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center gap-2 border border-gray-100">
                                    <Truck size={28} className="text-blue-500" />
                                    <span className="font-bold text-gray-900">Standard Delivery</span>
                                    <span className="text-sm">3 - 5 Business Days</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center gap-2 border border-gray-100">
                                    <Clock size={28} className="text-blue-500" />
                                    <span className="font-bold text-gray-900">Express Shipping</span>
                                    <span className="text-sm">1 - 2 Business Days</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center text-center gap-2 border border-gray-100">
                                    <ShieldCheck size={28} className="text-blue-500" />
                                    <span className="font-bold text-gray-900">Return Policy</span>
                                    <span className="text-sm">30 Days Money Back</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                All items are carefully packaged and shipped with tracking information. International shipping times may vary based on customs processing in your region.
                            </p>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="flex flex-col gap-5 animate-fade-in">
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                                <div className="w-16 h-16 bg-blue-50 rounded flex items-center justify-center border border-blue-100">
                                    <Store size={32} className="text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg text-gray-900">Official Brand Store</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <Rating value={4.8} readOnly size="small" sx={{ color: '#FF9017' }} />
                                        <span>(4.8) • 10k+ followers</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm">
                                We are a certified top-rated seller specializing in high-quality consumer goods. Our commitment is to provide premium products with exceptional customer service. 
                            </p>
                            <div className="grid grid-cols-2 gap-y-3 text-sm mt-2">
                                <div className="flex flex-col"><span className="text-gray-400">Location</span><span className="font-medium text-gray-900">United States</span></div>
                                <div className="flex flex-col"><span className="text-gray-400">Member Since</span><span className="font-medium text-gray-900">2021</span></div>
                                <div className="flex flex-col"><span className="text-gray-400">Response Rate</span><span className="font-medium text-gray-900">98%</span></div>
                                <div className="flex flex-col"><span className="text-gray-400">On-Time Delivery</span><span className="font-medium text-gray-900">100%</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full lg:w-[280px] bg-white border border-gray-200 rounded-lg shadow-sm p-4 h-fit shrink-0">
                <h3 className="font-bold text-gray-900 mb-4">You may like</h3>
                
                <div className="flex flex-col gap-4">
                    {sidebarProducts.map(item => (
                        <Link 
                            key={item.id} 
                            to={`/product/${item.id}`} 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-3 group cursor-pointer"
                        >
                            <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded flex items-center justify-center p-2 shrink-0 group-hover:border-blue-300 transition-colors">
                                <img src={item.image || item.images?.[0]} alt={item.title} className="max-w-full max-h-full mix-blend-multiply object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-[14px] text-gray-800 font-medium leading-snug mb-1 group-hover:text-blue-600 line-clamp-2">
                                    {item.title}
                                </h4>
                                <span className="text-gray-500 text-[13px] mb-0.5">${Number(item.price).toFixed(2)}</span>
                            </div>
                        </Link>
                    ))}
                    
                    {sidebarProducts.length === 0 && (
                        <div className="text-sm text-gray-400 text-center py-4">Loading suggestions...</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default DetailsTab;