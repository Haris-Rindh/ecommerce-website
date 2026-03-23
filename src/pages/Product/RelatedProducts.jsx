import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const RelatedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const q = query(collection(db, "products"), limit(6));
                const snap = await getDocs(q);
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(data);
            } catch (error) {
                console.error("Error fetching related products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRelated();
    }, []);

    if (loading) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 font-sans mt-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related products</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map(item => (
                    <Link 
                        key={item.id} 
                        to={`/product/${item.id}`} 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Forces scroll to top!
                        className="flex flex-col group cursor-pointer"
                    >
                        <div className="w-full h-36 bg-gray-50 rounded-md mb-3 flex items-center justify-center p-3 border border-gray-100 group-hover:border-blue-300 transition-colors">
                            <img src={item.image || item.images?.[0]} alt={item.title} className="max-w-full max-h-full mix-blend-multiply object-contain transition-transform group-hover:scale-105" />
                        </div>
                        <h4 className="text-sm text-gray-700 leading-tight mb-1 group-hover:text-blue-600 line-clamp-2">
                            {item.title}
                        </h4>
                        <span className="font-bold text-gray-900">${Number(item.discountedPrice || item.price).toFixed(2)}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;