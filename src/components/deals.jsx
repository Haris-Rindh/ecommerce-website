import Countdown from './countdown'
import {smartWatch, laptops, goPro, GamingHeadphones, CanonCameras} from '../assets/images/index'

const Deals = () => {

    const startingTime = (4 * 24 * 60 * 60 * 1000) + (13 * 60 * 60 * 1000) + (34 * 60 * 1000)
    return (
        <div className='mx-auto mt-6 max-w-[1180px] h-[240px] flex overflow-hidden border border-gray-200 bg-white rounded-md shadow-sm'>
            
            <div className='w-[280px] flex flex-col shrink-0 p-6 pt-7 shadow-sm'>
                <h2 className='font-semibold text-xl text-gray-900 leading-tight mb-1'>Deals and offers</h2>
                <h2 className='font-normal text-[16px] text-gray-500 mb-4'>Hygiene equipments</h2>

                <Countdown initialTime={startingTime} />
            </div>
                <div className='flex flex-1 overflow-x-auto'>
                    <DealCard images={smartWatch} label="Smart Watches" disc="-20%" />
                    <DealCard images={laptops} label="Laptops" disc="-20%" />
                    <DealCard images={goPro} label="GoPro Camera" disc="-20%" imgClass="scale-150" />
                    <DealCard images={GamingHeadphones} label="Headphones" disc="-20%" imgClass="scale-110" />
                    <DealCard images={CanonCameras} label="Canon Camreras" disc="-20%" />
                </div>
        </div>
    )
}

function DealCard({images, label, disc, imgClass = ""}) {
    return (
        <div className='w-[179px] shrink-0 h-full flex flex-col items-center pt-5 border-l border-gray-200 cursor-pointer transition-colors hover:bg-gray-50'>
            <div className='w-[130px] h-[130px] flex items-center justify-center mb-2'>
                <img 
                src={images} 
                alt={label} 
                className={`max-w-full max-h-full object-contain mix-blend-multiply transition-transform ${imgClass}`}
                />
            </div>
            <h3 className='text-[16px] text-gray-800 font-normal mb-2 text-center px-2 truncate w-full'>{label}</h3>
            <span className='px-4 py-2 bg-[#FFE3E3] text-[#EB001B] font-semibold rounded-full text-[14px] leading-none'>
                {disc}
            </span>
        </div>
    )
}

export default Deals
