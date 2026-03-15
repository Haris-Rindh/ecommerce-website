import React from 'react'
import { Link } from 'react-router-dom';
import {bannerImage, profilePic} from '../assets/images/index'


const categories = [
    { name: "Automobiles", path: "/categories/automobiles"},
    { name: "Clothes and wear", path: "/categories/clothes-and-wear"},
    { name: "Home interiors", path: "/categories/home-interiors"},
    { name: "Electronics", path: "/categories/electronics"},
    { name: "Computer and tech", path: "/category/computer-and-tech" },
    { name: "Tools, equipment", path: "/category/tools" },
    { name: "Sports and outdoors", path: "/category/sports" },
    { name: "Animal and pets", path: "/category/pets" },
    { name: "Machinery tools", path: "/category/machinery" }
];

const Herosection = () => {
    return (
        <div className='mx-auto mt-4 max-w-[1180px] h-[400px] grid grid-cols-[250px_1fr_200px] overflow-hidden border border-gray-200 bg-white p-4 rounded gap-4 shadow-sm'>    

            <div className='h-full bg-white' >
                <ul className='flex flex-col gap-1 pr-2'>
                    {categories.map((cate, idx) =>
                    <li key={idx}>
                        <Link 
                            to={cate.path}
                            className='block px-3 py-1 rounded-md hover:bg-[#E5F1FF] hover:font-semibold text-gray-700 transition-normal'
                        >
                                {cate.name}
                        </Link>
                    </li>
                    )}
                    <li>
                        <button 
                            className='w-full text-left p-2 font-medium rounded-md hover:bg-[#E5F1FF] transition-colors'
                        >
                                More category...
                        </button>
                    </li>
                </ul>
            </div>

            <div className="bg-cover bg-center flex flex-col items-start p-10" 
            style={{ backgroundImage: `url(${bannerImage})` }}
            >
                <h2 className='font-normal text-3xl text-gray-800 mb-1 mt-4'>Latest trending</h2>
                <h2 className='font-bold text-4xl text-gray-900 mb-6'>Electronic items</h2>
                <button className='w-fit px-6 py-2 bg-white rounded-md hover:bg-blue-500 
                text-gray-900 hover:text-white font-medium transition-colors shadow-sm'>
                    Learn More
                </button>
            </div>
            
            <div className='flex flex-col gap-3'>

                <div className='w-full bg-[#E3F0FF] rounded-md p-3 flex flex-col gap-3'>

                    <div className='flex items-center gap-3'>
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                            <img src={profilePic} alt="profile" className='w-full h-full object-cover' />
                        </div>
                        <p className='text-[15px] leading-tight text-gray-800'>
                            Hi, user <br />
                            let's get started
                        </p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <button className='w-full py-1.5 text-white bg-[#0D6EFD] rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm text-sm'>
                            Join now
                        </button>
                        <button className='w-full py-1.5 bg-white text-[#0D6EFD] rounded-md hover:bg-blue-500 hover:text-white font-medium transition-colors shadow-sm
                        border border-gray-200 text-sm'>
                            Log in
                        </button>
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

export default Herosection
