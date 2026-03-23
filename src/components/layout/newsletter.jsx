import React from 'react'
import { Mail } from 'lucide-react'

const Newsletter = () => {
    return (
        <div 
            className='w-full h-auto md:h-[190px] bg-gray-100 flex flex-col items-center justify-center py-8 md:py-0 px-4'
        >
            <h4 
                className='text-xl font-semibold text-gray-900 leading-tight text-center'
            >
                    Subscribe on our newsletter
            </h4>
            <p 
                className='text-[14px] md:text-[16px] font-normal text-gray-600 mb-6 text-center mt-2 md:mt-0'
            >
                Get daily news on upcoming offers from many suppliers all over the world
            </p>
            <form 
                className='flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto' 
                onSubmit={(e) => e.preventDefault()}
            >
                <div className='relative w-full sm:w-auto'>
                    <Mail 
                        size={20} 
                        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className='w-full sm:w-[274px] pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white transition-colors text-sm md:text-base'
                    />
                </div>
                
                <button 
                    type="submit" 
                    className='w-full sm:w-auto bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm'
                >
                    Subscribe
                </button>
            </form>
        </div>
    )
}

export default Newsletter
