import React from 'react'
import { cart_bg, softChair, lamp, dishes, pot, mixer, blender, appliance, plant, smartWatch, goPro, GamingHeadphones, whiteHeadphone, electricKettle, laptops, smartPhone, smartTablet, techBg } from '../assets/images/index'

const Homeitems = () => {
    return (
        <>
        {/*=========================================================================================Home and outdoors============================================================================================*/}
            <div
                className='mx-auto mt-6 mb-10 max-w-[1180px] h-[257px] flex overflow-hidden border border-gray-200 bg-white rounded-md shadow-sm'>
                <div
                    className='w-[280px] shrink-0 p-6 flex flex-col bg-cover bg-center'
                    style={{ backgroundImage: `url(${cart_bg})` }}
                >
                    <h4
                        className='font-semibold text-xl leading-tight'>
                        Home and<br /> outdoor
                    </h4>
                    <button
                        className='w-fit bg-white px-4 py-2 mt-4 rounded-md text-gray-900 font-semibold hover:bg-gray-100 shadow-sm transition-colors'
                    >
                        Source now
                    </button>
                </div>

                <div className='flex-1 grid grid-cols-4 grid-rows-2'>
                    <ItemCard title="Soft chairs" price="USD 19" image={softChair} />
                    <ItemCard title="Sofa & chair" price="USD 19" image={lamp} />
                    <ItemCard title="Kitchen dishes" price="USD 19" image={dishes} />
                    <ItemCard title="Smart watches" price="USD 19" image={pot} />

                    <ItemCard title="Kitchen mixer" price="USD 100" image={mixer} />
                    <ItemCard title="Blenders" price="USD 39" image={blender} />
                    <ItemCard title="Home appliance" price="USD 19" image={appliance} />
                    <ItemCard title="Coffee maker" price="USD 10" image={plant} />
                </div>
            </div>

            {/*=========================================================================================Electronics and Gadgets============================================================================================*/}
            <div
                className='mx-auto mt-6 mb-10 max-w-[1180px] h-[257px] flex overflow-hidden border border-gray-200 bg-white rounded-md shadow-sm'>
                <div
                    className='w-[280px] shrink-0 p-6 flex flex-col bg-cover bg-center'
                    style={{ backgroundImage: `url(${techBg})` }}
                >
                    <h4
                        className='font-semibold text-xl leading-tight'>
                        Consumer<br />electronics and <br /> gadgets
                    </h4>
                    <button
                        className='w-fit bg-white px-4 py-2 mt-4 rounded-md text-gray-900 font-semibold hover:bg-gray-100 shadow-sm transition-colors'
                    >
                        Source now
                    </button>
                </div>

                <div className='flex-1 grid grid-cols-4 grid-rows-2'>
                    <ItemCard title="Smart watches" price="USD 19" image={smartWatch} />
                    <ItemCard title="Cameras" price="USD 89" image={goPro} />
                    <ItemCard title="Headphones" price="USD 10" image={whiteHeadphone} />
                    <ItemCard title="Electric kettle" price="USD 90" image={electricKettle} />
                    <ItemCard title="Gaming set" price="USD 35" image={GamingHeadphones} />
                    <ItemCard title="Laptops & PC" price="USD 340" image={laptops} />
                    <ItemCard title="Smartphones" price="USD 19" image={smartPhone} />
                    <ItemCard title="Smart Tabs" price="USD 240" image={smartTablet} />
                </div>
            </div>
        </>
    )
}

function ItemCard({ title, price, image }) {
    return (
        <div className="relative border-l border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors overflow-hidden">
            <h4 className="text-[16px] mb-1 text-gray-900 leading-tight">{title}</h4>
            <p className="text-[13px] text-gray-500 leading-snug">From<br />{price}</p>
            <div className="absolute bottom-0 right-0 w-[82px] h-[82px] flex items-end justify-end pr-2 pb-2">
                <img src={image}
                    alt={title}
                    className='max-w-full max-h-full object-contain mix-blend-multiply'
                />
            </div>
        </div>
    )
}

export default Homeitems
