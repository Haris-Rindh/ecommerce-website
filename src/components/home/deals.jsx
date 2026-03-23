import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Countdown from './countdown';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const Deals = () => {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const cachedDeals = sessionStorage.getItem('homeItems_deals');
                if (cachedDeals) {
                    setDeals(JSON.parse(cachedDeals));
                    return;
                }

                const q = query(collection(db, "products"), limit(50));
                const snap = await getDocs(q);
                const fetchedDeals = snap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(product => product.discountedPrice < product.price)
                    .slice(0, 5);
                
                setDeals(fetchedDeals);
                sessionStorage.setItem('homeItems_deals', JSON.stringify(fetchedDeals));
            } catch (error) {
                console.error("Error fetching deals:", error);
            }
        };
        fetchDeals();
    }, []);

    const startingTime = (4 * 24 * 60 * 60 * 1000) + (13 * 60 * 60 * 1000) + (34 * 60 * 1000)
    
    return (
        <div className='w-full mx-auto mt-4 md:mt-6 max-w-[1180px] flex flex-col md:flex-row overflow-hidden border border-gray-200 bg-white rounded-md shadow-sm md:h-[240px]'>
            
            <div className='w-full md:w-[280px] flex flex-row md:flex-col shrink-0 p-4 md:p-6 md:pt-7 shadow-sm justify-between md:justify-start items-center md:items-start border-b md:border-b-0 border-gray-200'>
                <div>
                   <h2 className='font-semibold text-lg md:text-xl text-gray-900 leading-tight mb-2 md:mb-1'>Deals and offers</h2>
                   <h2 className='font-normal text-sm md:text-[16px] text-gray-500 mb-0 md:hidden'>Electronic equipments</h2>
                   <h2 className='font-normal text-[16px] text-gray-500 mb-4 hidden md:block'>Hygiene equipments</h2>
                </div>

                <Countdown initialTime={startingTime} />
            </div>
            
            <div className='flex flex-1 overflow-x-auto no-scrollbar'>
                {deals.map(deal => {
                    const discountPercentage = Math.round(((deal.price - deal.discountedPrice) / deal.price) * 100);
                    return (
                        <DealCard 
                            key={deal.id} 
                            id={deal.id}
                            image={deal.images?.[0] || deal.image} 
                            label={deal.title} 
                            disc={`-${discountPercentage}%`} 
                        />
                    );
                })}
            </div>
        </div>
    )
}

function DealCard({id, image, label, disc, imgClass = ""}) {
    return (
        <Link to={`/product/${id}`} className='w-[140px] md:w-[179px] shrink-0 h-full flex flex-col items-center justify-between pt-3 md:pt-5 border-l border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 block pb-4 md:pb-5 bg-white'>
            <div className='w-full flex-1 flex flex-col items-center justify-start'>
                <div className='w-[100px] h-[100px] md:w-[120px] md:h-[120px] flex items-center justify-center mb-2 md:mb-3'>
                    <img src={image} alt={label} className={`max-w-full max-h-full object-contain mix-blend-multiply transition-transform ${imgClass}`} />
                </div>
                <h3 className='text-[13px] md:text-[14px] text-gray-800 font-medium mb-2 text-center px-3 line-clamp-2 w-full leading-snug'>{label}</h3>
            </div>
            <span className='px-3 py-1.5 md:px-4 md:py-1.5 bg-[#FFE3E3] text-[#EB001B] font-semibold rounded-full text-[13px] md:text-[14px] leading-none mt-auto shrink-0'>
                {disc}
            </span>
        </Link>
    )
}

export default Deals;