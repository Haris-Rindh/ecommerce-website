import React from 'react'
import { UAE, Australia, US, Russia, Italy, Denmark, France, Germany, China, Britain } from '../../assets/images/index'

const suppliers = [
    {
        Id: 1,
        Flag: UAE,
        Name: "Arabic Emirates",
        Link: "shopname.ae"
    },
    {
        Id: 2,
        Flag: Australia,
        Name: "Australia",
        Link: "shopname.ae"
    },
    {
        Id: 3,
        Flag: US,
        Name: "United States",
        Link: "shopname.ae"
    },
    {
        Id: 4,
        Flag: Russia,
        Name: "Russia",
        Link: "shopname.ru"
    },
    {
        Id: 5,
        Flag: Italy,
        Name: "Italy",
        Link: "shopname.it"
    },
    {
        Id: 6,
        Flag: Denmark,
        Name: "Denmark",
        Link: "denmark.com.dk"
    },
    {
        Id: 7,
        Flag: France,
        Name: "France",
        Link: "shopname.com.fr"
    },
    {
        Id: 8,
        Flag: Germany,
        Name: "Germany",
        Link: "shopname.ae"
    },
    {
        Id: 9,
        Flag: China,
        Name: "China",
        Link: "shopname.ae"
    },
    {
        Id: 10,
        Flag: Britain,
        Name: "Great Britain",
        Link: "shopname.co.uk"
    }
]
const Suppliers = () => {
    return (
        <div className='mx-auto mt-6 mb-10 max-w-[1180px] px-4 xl:px-0'>
            <h3 className='text-xl md:text-2xl font-semibold text-gray-900 pb-4 md:pb-6'>Suppliers by region</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 md:gap-y-[24px] gap-x-3 md:gap-x-[18px]">
            {suppliers.map((supplier) => (
                <SupplierCard 
                    key={supplier.Id}
                    Flag={supplier.Flag}
                    Name={supplier.Name}
                    Link={supplier.Link}
                />
                ))}
            </div>
        </div>
    )
}

function SupplierCard({ Flag, Name, Link }) {
    return (
        <div className='w-full md:w-[221px] flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity cursor-pointer'>
            <div className='w-[28px] h-[20px] flex-shrink-0'>
                <img 
                src={Flag} 
                alt={Name} 
                className='w-full h-full object-cover border border-gray-100'
                />
            </div>
            <div className='flex flex-col justify-center'>
                <span className='text-gray-900 text-[16px] leading-tight font-normal'>{Name}</span>
                <a href={Link} className='text-gray-500 text-[13px] leading-tight mt-[2px]'>{Link}</a>
            </div>
        </div>
    )
}

export default Suppliers
