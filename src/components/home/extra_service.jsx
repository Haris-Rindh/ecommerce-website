import {Search, Box, Send, Shield} from "lucide-react";
import { MaskGroup, MaskGroup2, personBg, planeBg } from '../../assets/images';

const services = [
    {
        id: 1, 
        image: MaskGroup, 
        alt: "Industry_Hub", 
        Description: "Source from Industry Hubs",
        Icon: Search
    },
    {
        id: 2, 
        image: MaskGroup2, 
        alt: "Products", 
        Description: "Customize Your Products",
        Icon: Box
    },
    {
        id: 3, 
        image: planeBg, 
        alt: "Plane", 
        Description: "Fast, reliable shipping by ocean or air",
        Icon: Send
    },
    {
        id: 4, 
        image: personBg, 
        alt: "Inspection", 
        Description: "Product monitoring and inspection",
        Icon: Shield
    }
];

const Extra_service = () => {
    return (
        <div className='mx-auto mt-6 mb-10 max-w-[1180px] px-4 xl:px-0'>
            <h3 className='text-xl md:text-2xl font-semibold pb-4 md:pb-6'>Our extra services</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {services.map((service) => (
                    <ServiceCard 
                        key={service.id}
                        Image={service.image}
                        Alt={service.alt}
                        Description={service.Description}
                        Icon={service.Icon}
                    />
                ))}
            </div>
        </div>
    )
}

function ServiceCard({Image, Alt, Description, Icon}) {
    return (
        <div className='w-full h-auto md:h-[200px] bg-white border border-gray-200 rounded-lg flex flex-col hover:shadow-sm transition-shadow relative group pb-4 md:pb-0'>
            <div className="relative h-[120px] w-full shrink-0">
                <img
                    src={Image}
                    alt={Alt}
                    className='w-full h-full object-cover rounded-t-lg'
                />

                <button className='absolute -bottom-[24px] right-4 w-[58px] h-[58px] bg-[#E3F0FF] rounded-full border-[3px] border-white flex justify-center items-center group-hover:bg-blue-100 transition-colors'>
                    <Icon size={20} className="text-gray-800" />
                </button>
            </div>

            <div className='pr-16'>
                <p className='px-7 py-4 text-gray-900 font-medium leading-snug'>{Description}</p>
            </div>
        </div>
    )
}

export default Extra_service
