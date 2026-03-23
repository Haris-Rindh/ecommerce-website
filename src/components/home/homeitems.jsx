import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import cart_bg from '../../assets/images/backgrounds/cart_bg.png';
import techBg from '../../assets/images/backgrounds/tech_bg.png';

const Homeitems = () => {
    const [homeProducts, setHomeProducts] = useState([]);
    const [techProducts, setTechProducts] = useState([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const cachedHome = sessionStorage.getItem('homeItems_home');
                const cachedTech = sessionStorage.getItem('homeItems_tech');

                if (cachedHome && cachedTech) {
                    setHomeProducts(JSON.parse(cachedHome));
                    setTechProducts(JSON.parse(cachedTech));
                    return;
                }

                const homeQ = query(collection(db, "products"), where("categorySlug", "==", "home-interiors"), limit(8));
                const homeSnap = await getDocs(homeQ);
                const homeData = homeSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setHomeProducts(homeData);
                sessionStorage.setItem('homeItems_home', JSON.stringify(homeData));

                const techQ = query(collection(db, "products"), where("categorySlug", "==", "electronics"), limit(8));
                const techSnap = await getDocs(techQ);
                const techData = techSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setTechProducts(techData);
                sessionStorage.setItem('homeItems_tech', JSON.stringify(techData));
            } catch (error) {
                console.error("Error fetching home items:", error);
            }
        };
        fetchSections();
    }, []);

    return (
        <>
            {/* Home and outdoors */}
            <div className='w-full mx-auto mt-4 md:mt-6 mb-6 md:mb-10 max-w-[1180px] flex flex-col md:flex-row overflow-hidden border border-gray-200 bg-white rounded-md shadow-sm md:h-[257px]'>
                <h3 className="md:hidden font-semibold text-lg text-gray-900 px-4 pt-4 pb-1">Home and outdoor</h3>
                
                <div 
                    className='hidden md:flex w-[280px] shrink-0 p-6 flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url(${cart_bg})` }}
                >
                    <div className="absolute inset-0 bg-black/30 z-0"></div> 
                    <div className="relative z-10 flex flex-col h-full">
                        <h4 className='font-semibold text-xl leading-tight text-white'>Home and<br /> outdoor</h4>
                        <Link to="/category/home-interiors" className='w-fit bg-white px-4 py-2 mt-4 rounded-md text-gray-900 font-semibold hover:bg-gray-100 shadow-sm transition-colors'>Source now</Link>
                    </div>
                </div>

                <div className='flex-1 flex overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:grid-rows-2 bg-gray-200 gap-[1px] border-l border-gray-200'>
                    {homeProducts.slice(0, 4).map(product => (
                        <div key={product.id} className="w-[140px] shrink-0 lg:w-auto lg:shrink lg:h-full">
                            <ItemCard id={product.id} title={product.title} price={product.price} image={product.images?.[0] || product.image} />
                        </div>
                    ))}
                    {homeProducts.slice(4).map(product => (
                        <div key={`hidden-${product.id}`} className="hidden lg:block lg:h-full">
                            <ItemCard id={product.id} title={product.title} price={product.price} image={product.images?.[0] || product.image} />
                        </div>
                    ))}
                </div>
                <div className="md:hidden border-t border-gray-200 p-3 px-4">
                    <Link to="/category/home-interiors" className='flex items-center text-[#0D6EFD] font-medium text-[15px] hover:underline'>Source now <span className="ml-1 text-lg leading-none">→</span></Link>
                </div>
            </div>

            {/* Electronics */}
            <div className='w-full mx-auto mt-4 md:mt-6 mb-10 max-w-[1180px] flex flex-col md:flex-row overflow-hidden border border-gray-200 bg-white rounded-md shadow-sm md:h-[257px]'>
                <h3 className="md:hidden font-semibold text-lg text-gray-900 px-4 pt-4 pb-1">Consumer electronics</h3>
                
                <div 
                    className='hidden md:flex w-[280px] shrink-0 p-6 flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url(${techBg})` }}
                >
                    <div className="absolute inset-0 bg-black/30 z-0"></div> 
                    <div className="relative z-10 flex flex-col h-full">
                        <h4 className='font-semibold text-xl leading-tight text-white'>Consumer<br />electronics and <br /> gadgets</h4>
                        <Link to="/category/electronics" className='w-fit bg-white px-4 py-2 mt-4 rounded-md text-gray-900 font-semibold hover:bg-gray-100 shadow-sm transition-colors'>Source now</Link>
                    </div>
                </div>

                <div className='flex-1 flex overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:grid-rows-2 bg-gray-200 gap-[1px] border-l border-gray-200'>
                    {techProducts.slice(0, 4).map(product => (
                        <div key={product.id} className="w-[140px] shrink-0 lg:w-auto lg:shrink lg:h-full">
                            <ItemCard id={product.id} title={product.title} price={product.price} image={product.images?.[0] || product.image} />
                        </div>
                    ))}
                    {techProducts.slice(4).map(product => (
                        <div key={`hidden-${product.id}`} className="hidden lg:block lg:h-full">
                            <ItemCard id={product.id} title={product.title} price={product.price} image={product.images?.[0] || product.image} />
                        </div>
                    ))}
                </div>
                <div className="md:hidden border-t border-gray-200 p-3 px-4">
                    <Link to="/category/electronics" className='flex items-center text-[#0D6EFD] font-medium text-[15px] hover:underline'>Source now <span className="ml-1 text-lg leading-none">→</span></Link>
                </div>
            </div>
        </>
    )
}

function ItemCard({ id, title, price, image }) {
    return (
        <Link to={`/product/${id}`} className="relative p-2 lg:p-4 hover:bg-gray-50 hover:shadow-inner cursor-pointer transition-all overflow-hidden flex flex-col lg:block group bg-white w-[130px] lg:w-full h-[155px] lg:h-full shrink-0 border-r lg:border-r-0 border-gray-200 lg:border-0">
            <div className="w-full h-[70px] lg:hidden flex items-center justify-center mb-1 shrink-0">
                {image && <img src={image} alt={title} className='max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300' />}
            </div>
            
            <div className="flex flex-col z-10 relative lg:max-w-[75%] flex-1 justify-end lg:justify-start">
                <h4 className="text-[13px] lg:text-[15px] mb-1 text-gray-900 leading-tight line-clamp-2 font-medium">{title}</h4>
                <p className="text-[12px] lg:text-[13px] text-gray-400 leading-tight lg:mt-1">
                    <span className="hidden lg:inline">From<br /></span>
                    <span className="lg:mt-1 block text-[13px] text-gray-500 font-medium">USD {Number(price).toFixed(2)}</span>
                </p>
            </div>
            
            {image && <div className="hidden lg:block absolute bottom-3 right-3 w-[75px] h-[75px]">
                <img src={image} alt={title} className='w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300' />
            </div>}
        </Link>
    )
}

export default Homeitems;