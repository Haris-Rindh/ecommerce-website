import { Bag, BrownJacket, goPro, JeansShort, Shirt, Wallet, GamingHeadphones, electricKettle, smartWatch, Coat } from '../assets/images/index'

const products = [
    {
        id: 1,
        image: Shirt,
        alt: "Shirt",
        price: "10.30",
        description: "T-shirts with multiple colors, for men"
    },
    {
        id: 2,
        image: JeansShort,
        alt: "Jeans Shorts",
        price: "10.30",
        description: "Jeans shorts for men blue color"
    },
    {
        id: 3,
        image: BrownJacket,
        alt: "Brown Jacket",
        price: "10.30",
        description: "Brown winter coat medium size"
    },
    {
        id: 4,
        image: Bag,
        alt: "Bag",
        price: "10.30",
        description: "Jeans bag for travel for women"
    },
    {
        id: 5,
        image: Coat,
        alt: "Wallet",
        price: "10.30",
        description: "Casual Blue coat with white shirt"
    },
    {
        id: 6,
        image: goPro,
        alt: "Camera",
        price: "10.30",
        description: "Canon camera black, 100x zoom"
    },
    {
        id: 7,
        image: GamingHeadphones,
        alt: "Headphones",
        price: "10.30",
        description: "Modern Headset for gaming with mic"
    },
    {
        id: 8,
        image: smartWatch,
        alt: "Smartwatch",
        price: "10.30",
        description: "Smartwatch silver color modern"
    },
    {
        id: 9,
        image: Wallet,
        alt: "Blue Wallet",
        price: "10.30",
        description: "Blue wallet for men leather material"
    },
    {
        id: 10,
        image: electricKettle,
        alt: "Kettle",
        price: "10.30",
        description: "Electric kettle with 1.5l capacity"
    }
];

const Recommended_items = () => {
    return (
        <div className='mx-auto mt-6 mb-10 max-w-[1180px] h-[696px]'>
            <h3 className='text-2xl font-semibold pb-10'>Recommended items</h3>

            <div className='grid grid-cols-5 gap-[20px]'>
                {products.map((product) => (
                    <ItemCard
                        key={product.id}
                        Image={product.image}
                        Alt={product.alt}
                        price={product.price}
                        description={product.description}
                    />
                ))}
            </div>
        </div>
    )
}

function ItemCard({ Image, Alt, price, description }) {
    return (
        <div className='w-[220px] h-[310px] bg-white border border-gray-200 rounded-md p-4 flex flex-col hover:shadow-sm transition-shadow'>

            <div className='h-[200px] w-full flex items-center justify-center p-2'>
                <img
                    src={Image}
                    alt={Alt}
                    className='w-full h-full object-contain'
                />
            </div>

            <div className='mt-auto pt-4'>
                <span className='font-medium text-gray-900 block'>${price}</span>
                <p className='text-gray-500 text-sm leading-tight mt-1 line-clamp-2'>{description}</p>
            </div>

        </div>
    )
}

export default Recommended_items