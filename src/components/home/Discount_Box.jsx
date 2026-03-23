import React from 'react'

const Discount_Box = () => {
    return (
        <div className="w-full bg-[linear-gradient(100deg,#237BFF_65%,#005ADE_65%)] rounded-lg overflow-hidden flex items-center justify-between px-8 py-6 shadow-sm">
            <div className="flex flex-col text-white">
                <h2 className="text-2xl font-semibold mb-1">Super discount on more than 100 USD</h2>
                <p className="text-[15px] opacity-80">Have you ever finally just write dummy info</p>
            </div>
            <button className="bg-[#FF9017] text-white font-semibold px-6 py-2 rounded shadow-sm hover:bg-[#E67E22] transition-colors">
                Shop now
            </button>
        </div>
    )
}

export default Discount_Box
