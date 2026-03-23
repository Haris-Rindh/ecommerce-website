import React from 'react'
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context/GlobalState';

const bannerImage = "https://i.postimg.cc/rFMmFbLq/Banner-board.png";

const categories = [
    { name: "Automobiles", path: "/category/automobiles" },
    { name: "Clothes and wear", path: "/category/clothes-and-wear" },
    { name: "Home interiors", path: "/category/home-interiors" },
    { name: "Electronics", path: "/category/electronics" },
    { name: "Computer and tech", path: "/category/computer-and-tech" },
    { name: "Tools, equipment", path: "/category/tools" },
    { name: "Sports and outdoors", path: "/category/sports" },
    { name: "Animal and pets", path: "/category/pets" },
    { name: "Machinery tools", path: "/category/machinery" }
];

const Herosection = () => {
    const { user } = useGlobalContext(); 
    
    const getHeroAvatar = () => {
        if (!user) return <img src="https://ui-avatars.com/api/?name=User&background=0D6EFD&color=fff" alt="User" className="w-full h-full object-cover" />;
        if (user.photoURL) return <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />;
        const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
        return <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">{initial}</div>;
    };

    return (
        <div className='mx-auto mt-3 md:mt-4 max-w-[1180px] flex flex-col lg:grid lg:grid-cols-[250px_1fr_200px] lg:h-[400px] overflow-hidden border border-gray-200 bg-white p-3 md:p-4 rounded gap-3 md:gap-4 shadow-sm'>

            <div className='hidden lg:block h-full bg-white overflow-y-auto' >
                <ul className='flex flex-col gap-1 pr-2'>
                    {categories.map((cate, idx) =>
                        <li key={idx}><Link to={cate.path} className='block px-3 py-1 rounded-md hover:bg-[#E5F1FF] hover:font-semibold text-gray-700 transition-normal'>{cate.name}</Link></li>
                    )}
                    <li><Link to="/category/all" className='block w-full text-left px-3 py-2 font-medium rounded-md hover:bg-[#E5F1FF] text-blue-600 transition-colors'>More category...</Link></li>
                </ul>
            </div>

            <div className="bg-cover bg-center flex flex-col items-start p-6 md:p-10 rounded-md min-h-[160px] md:min-h-0" style={{ backgroundImage: `url(${bannerImage})` }}>
                <h2 className='font-normal text-[22px] md:text-3xl text-gray-800 mb-1 mt-2 md:mt-4 leading-tight'>Latest trending</h2>
                <h2 className='font-bold text-[28px] md:text-4xl text-gray-900 mb-4 md:mb-6 leading-tight'>Electronic items</h2>
                <Link to="/category/electronics" className='w-fit px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base bg-white rounded-md hover:bg-blue-500 text-gray-900 hover:text-white font-medium transition-colors shadow-sm inline-block'>Learn more</Link>
            </div>

            <div className='hidden lg:flex flex-col gap-3'>
                <div className='w-full bg-[#E3F0FF] rounded-md p-3 flex flex-col gap-3'>
                    <div className='flex items-center gap-3'>
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                            {getHeroAvatar()}
                        </div>
                        <p className='text-[15px] leading-tight text-gray-800'>
                            Hi, {user ? (user.displayName || "User") : "user"} <br /> let's get started
                        </p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {user ? (
                             <Link to="/profile" className='w-full text-center py-1.5 text-white bg-[#0D6EFD] rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm text-sm'>My Profile</Link>
                        ) : (
                            <>
                                <Link to="/login" className='w-full text-center py-1.5 text-white bg-[#0D6EFD] rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm text-sm'>Join now</Link>
                                <Link to="/login" className='w-full text-center py-1.5 bg-white text-[#0D6EFD] rounded-md hover:bg-blue-500 hover:text-white font-medium transition-colors shadow-sm border border-gray-200 text-sm'>Log in</Link>
                            </>
                        )}
                    </div>
                </div>
                <div className='bg-[#F38332] w-full p-4 flex-1 rounded-md'>
                    <p className='font-semibold text-[16px] text-white leading-snug '>Get US $10 off<br /> with a new <br /> supplier</p>
                </div>
                <div className='bg-[#55BDC3] w-full p-4 flex-1 rounded-md'>
                    <p className='font-semibold text-[16px] text-white leading-snug'>Send quotes with<br /> supplier<br /> preferences</p>
                </div>
            </div>
        </div>
    )
}
export default Herosection;