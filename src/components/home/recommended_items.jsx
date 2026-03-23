import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const Recommended_items = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const cachedRecommended = sessionStorage.getItem('homeItems_rec');
                if (cachedRecommended) {
                    setProducts(JSON.parse(cachedRecommended));
                    return;
                }
                
                const q = query(collection(db, "products"), where("isFigmaRecommended", "==", true), limit(10));
                const querySnapshot = await getDocs(q);
                const recData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(recData);
                sessionStorage.setItem('homeItems_rec', JSON.stringify(recData));
            } catch (error) {
                console.error("Error fetching recommended:", error);
            }
        };
        fetchRecommended();
    }, []);

    return (
        <div className='mx-auto mt-4 md:mt-6 mb-10 max-w-[1180px] px-2 md:px-0'>
            <h3 className='text-lg md:text-2xl font-semibold pb-4 md:pb-10 px-2 md:px-0'>Recommended items</h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-[20px]'>
                {products.map((product) => (
                    <ItemCard
                        key={product.id}
                        id={product.id}
                        Image={product.images?.[0] || product.image}
                        Alt={product.title}
                        price={product.discountedPrice || product.price}
                        description={product.title}
                    />
                ))}
            </div>
        </div>
    )
}

function ItemCard({ id, Image, Alt, price, description }) {
    return (
        <Link to={`/product/${id}`} className='w-full h-auto md:h-[310px] bg-white border border-gray-200 rounded-md p-3 md:p-4 flex flex-col hover:shadow-sm transition-shadow group block'>
            <div className='h-[140px] md:h-[200px] w-full flex items-center justify-center p-2'>
                {Image ? (
                    <img src={Image} alt={Alt} onError={(e) => { e.target.src = "https://placehold.co/400x400/EEEEEE/31343C?text=Image+Unavailable" }} className='max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300' />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
            </div>
            <div className='mt-auto pt-2 md:pt-4'>
                <span className='font-medium text-[15px] md:text-base text-gray-900 block'>${Number(price).toFixed(2)}</span>
                <p className='text-gray-500 text-[13px] md:text-sm leading-tight mt-1 line-clamp-2'>{description}</p>
            </div>
        </Link>
    )
}

export default Recommended_items;