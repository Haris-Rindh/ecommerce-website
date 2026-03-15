import React, { useState } from 'react';
import { ChevronRight, ChevronUp, ChevronDown, LayoutGrid, List, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';;
import Rating from '@mui/material/Rating';
import { Shirt, smartPhone } from '../../assets/images';

const Category = [
    { name: "Mobile accessory", path: "/category/mobile-accessory" },
    { name: "Electronics", path: "/category/electronics" },
    { name: "Smartphones", path: "/category/smartphones" },
    { name: "Modern tech", path: "/category/modern-tech" }
];

const Brand = [
    { name: "Samsung", path: "/category/samsung" },
    { name: "Apple", path: "/category/apple" },
    { name: "Huawei", path: "/category/huawei" },
    { name: "Pocco", path: "/category/modern-tech" },
    { name: "Lenovo", path: "/category/modern-tech" },
    { name: "Lenovo2", path: "/category/modern-tech" },
    { name: "Lenovo3", path: "/category/modern-tech" },
    { name: "Lenovo4", path: "/category/modern-tech" }
];

const Features = [
    { name: "Metallic", path: "/category/modern-tech" },
    { name: "Plastic cover", path: "/category/modern-tech" },
    { name: "8GB Ram", path: "/category/modern-tech" },
    { name: "Super Power", path: "/category/modern-tech" },
    { name: "Large Memory", path: "/category/modern-tech" }
];

const Conditions = [
    { name: "Any", path: "/category/modern-tech" },
    { name: "Refurbished", path: "/category/modern-tech" },
    { name: "Brand new", path: "/category/modern-tech" },
    { name: "Old Items", path: "/category/modern-tech" },
    { name: "Large Memory", path: "/category/modern-tech" }
];

const productsData = [
    {
        id: 1,
        categorySlug: "smartphones",
        image: smartPhone,
        brand: "Samsung",
        condition: "Brand new",
        features: ["8GB Ram", "Large Memory"],
        discountedPrice: 99.50,
        price: 112.00,
        rating: "7.5",
        description: "Samsung Galaxy Smartphone - Black"
    },
    {
        id: 2,
        categorySlug: "smartphones",
        image: smartPhone,
        brand: "Apple",
        condition: "Refurbished",
        features: ["Metallic"],
        discountedPrice: 85.00,
        price: 150.00,
        rating: "8.2",
        description: "Refurbished iPhone - Silver"
    },
    {
        id: 3,
        categorySlug: "smartphones",
        image: smartPhone,
        brand: "Pocco",
        condition: "Brand new",
        features: ["Super Power", "Plastic cover"],
        discountedPrice: 120.00,
        price: 140.00,
        rating: "6.5",
        description: "Pocco Heavy Duty Battery--------- Phone"
    },
    {
        id: 4,
        categorySlug: "smartphones",
        image: smartPhone,
        brand: "Samsung",
        condition: "Old Items",
        features: ["Plastic cover"],
        discountedPrice: 45.00,
        price: 80.00,
        rating: "5.0",
        description: "Used Samsung Budget ------ ===========Phone"
    }
];

const Ratings = [
    { name: "★★★★★" },
    { name: "★★★★☆" },
    { name: "★★★☆☆" },
    { name: "★★☆☆☆" }
];


const CategoryPage = () => {
    const { categoryName } = useParams();
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState({ name: "Featured" });
    const [view, setView] = useState("grid");
    const displayCategory = categoryName
        ? categoryName.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
        : "All Categories";
    
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 9999 });
    const [condition, setCondition] = useState('Any');
    const [selectedRatings, setSelectedRatings] = useState([]);

    const filterBox = [
        { name: "Featured" },
        { name: "Price: Low to High" },
        { name: "Price: High to Low" },
        { name: "Newest Arrivals" },
        { name: "Best Selling" },
        { name: "Top Rated" },
    ];

    const handleCheckboxChange = (stateArray, setStateFunction, itemName, isChecked) => {
        if (isChecked) {
            setStateFunction([...stateArray, itemName]);
        } else {
            setStateFunction(stateArray.filter(item => item !== itemName));
        }
    };

    const filteredProducts = productsData.filter((product) => {
        const matchesCategory = !categoryName || product.categorySlug === categoryName;
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const matchesFeatures = selectedFeatures.length === 0 || selectedFeatures.some(feature => product.features.includes(feature));
        const matchesPrice = product.discountedPrice >= priceRange.min && product.discountedPrice <= priceRange.max;
        const matchesCondition = condition === 'Any' || product.condition === condition;

        const starCount = Math.floor(Number(product.rating) / 2);
        let productStarString = "";
        if (starCount === 5) productStarString = "★★★★★";
        if (starCount === 4) productStarString = "★★★★☆";
        if (starCount === 3) productStarString = "★★★☆☆";
        if (starCount === 2) productStarString = "★★☆☆☆";

        const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(productStarString);

        return matchesCategory &&  matchesBrand && matchesFeatures && matchesPrice && matchesCondition && matchesRating;
    });

    return (
        <div className='mx-auto max-w-[1180px] py-6'>
            <div className='flex items-center gap-2 text-gray-500 text-sm mb-6'>
                <Link to="/" className='hover:text-blue-600 transition-colors'>Home</Link>
                <ChevronRight size={16} />
                <Link className='hover:text-blue-400'>Clothing</Link>
                <ChevronRight size={16} />
                <Link className='hover:text-blue-400'>{displayCategory}</Link>
            </div>

            <div className='flex gap-2'>
                <aside className='w-60'>
                    <div className='h-full'>
                        <Filter
                            name="Category"
                            data={Category}
                            type="text"
                        />
                        <Filter
                            name="Brand"
                            data={Brand}
                            type="checkbox"
                            selectedValues={selectedBrands}
                            onChange={(itemName, isChecked) => handleCheckboxChange(selectedBrands, setSelectedBrands, itemName, isChecked)}
                        />
                        <Filter
                            name="Features"
                            data={Features}
                            type="checkbox"
                            selectedValues={selectedFeatures}
                            onChange={(itemName, isChecked) => handleCheckboxChange(selectedFeatures, setSelectedFeatures, itemName, isChecked)}
                        />
                        <PriceRange onApply={(range) => setPriceRange(range)} />
                        <Filter
                            name="Condition"
                            data={Conditions}
                            type="radio"
                            showSeeMore={false}
                            selectedValues={condition}
                            onChange={(itemName) => setCondition(itemName)}
                        />

                        <Filter
                            name="Ratings"
                            data={Ratings}
                            type="checkbox"
                            showSeeMore={false}
                            selectedValues={selectedRatings}
                            onChange={(itemName, isChecked) => handleCheckboxChange(selectedRatings, setSelectedRatings, itemName, isChecked)}
                        />
                    </div>
                </aside>
                <main className="flex-1">
                    <div
                        className="p-3 mb-4 bg-white border border-gray-200 rounded-md flex items-center justify-between shadow-sm">
                        <span className="text-gray-900">
                            {filteredProducts.length} items in <strong>{displayCategory}</strong>
                        </span>

                        <div className='flex gap-4 items-center'>
                            <label className="flex items-center cursor-pointer text-gray-700 hover:text-blue-600">
                                <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300" />
                                <span>Verified only</span>
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterBoxOpen(!isFilterBoxOpen)}
                                    className=" px-3 py-2 flex items-center justify-between w-44 gap-2 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <span
                                        className="text-[15px] font-medium">
                                        {selectedFilter.name}
                                    </span>

                                    <ChevronDown size={18}
                                        className={`transform transition-transform ${isFilterBoxOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {isFilterBoxOpen && (
                                    <div
                                        className="absolute right-0 mb-10 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden flex flex-col z-10"
                                    >
                                        {filterBox.map((lang, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedFilter(lang);
                                                    setIsFilterBoxOpen(false);
                                                }}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='flex rounded border border-gray-200 overflow-hidden'>
                                <button
                                    onClick={() => setView("grid")}
                                    className={`p-2 ${view === "grid" ? "bg-gray-200" : "bg-white"} hover:bg-gray-100 transition-colors`}
                                >
                                    < LayoutGrid
                                        size={24} fill='black' />
                                </button>
                                <button
                                    onClick={() => setView("list")}
                                    className={`p-2 ${view === "list" ? "bg-gray-200" : "bg-white"} hover:bg-gray-100 transition-colors`}
                                >
                                    < List
                                        size={24} fill='black' />
                                </button>
                            </div>
                        </div>
                    </div>
                    {(selectedBrands.length > 0 || selectedFeatures.length > 0) && (
                        <div className="flex items-center gap-2 mb-4 mt-4 flex-wrap">

                            {selectedBrands.map((brand) => (
                                <span key={brand} className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-600 text-sm flex items-center gap-2">
                                    {brand}
                                    <button
                                        onClick={() => handleCheckboxChange(selectedBrands, setSelectedBrands, brand, false)}
                                        className="text-gray-400 hover:text-red-500 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            {selectedFeatures.map((feature) => (
                                <span key={feature} className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-600 text-sm flex items-center gap-2">
                                    {feature}
                                    <button
                                        onClick={() => handleCheckboxChange(selectedFeatures, setSelectedFeatures, feature, false)}
                                        className="text-gray-400 hover:text-red-500 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            <button
                                onClick={() => {
                                    setSelectedBrands([]);
                                    setSelectedFeatures([]);
                                    setSelectedRatings([]);
                                    setCondition('Any');
                                    setPriceRange({ min: 0, max: 99999 });
                                }}
                                className="text-blue-600 text-sm font-medium hover:underline ml-2"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                    <div className='grid grid-cols-3 gap-5 mt-5'>

                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    image={product.image}
                                    price={product.price}
                                    discountedPrice={product.discountedPrice}
                                    description={product.description}
                                    rating={product.rating}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 py-20 text-center text-gray-500 text-lg">
                                No products match your selected filters. Try clearing some!
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    )
}

function AsideHeading({ Heading }) {
    return (
        <div className=''>
            <button className='flex items-center justify-between w-full px-6 py-4 font-semibold text-[16px] text-gray-900 leading-snug'>
                {Heading}
                <ChevronUp size={20} />
            </button>
        </div>
    )
}


function SeeMore({ isExpanded, setIsExpanded }) {
    return (
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='w-full text-left px-6 pb-6 font-medium rounded-md text-[#0D6EFD] hover:text-blue-400 transition-colors cursor-pointer'
        >
            {isExpanded ? "See less" : "See more"}
        </button>
    )
}
function Filter({ name, data, type, showSeeMore = true, selectedValues = [], onChange }) {
    const [isExpanded, setIsExpanded] = useState(false);
    // If the list is 5 items or less, we don't need to slice it
    const displayedItems = isExpanded ? data : data.slice(0, 5);

    return (
        <div className='flex flex-col border-t border-gray-300'>
            <AsideHeading Heading={name} />

            {/* The scrollable box MUST wrap the map function! */}
            <div className='max-h-48 overflow-y-auto'>
                {displayedItems.map((item, idx) => {
                    const id = `${name}-${idx}`
                    return (
                        <label
                            key={idx}
                            htmlFor={id}
                            className={`flex mb-2 px-6 cursor-pointer text-gray-700 hover:text-blue-600 ${type !== "text" ? "items-center gap-2" : ""}`}
                        >
                            {type !== "text" && (
                                <input
                                    id={id}
                                    type={type}
                                    name={type === "radio" ? name : undefined}
                                    className='w-4 h-4 rounded border-gray-300'
                                    checked={type === 'checkbox' ? selectedValues.includes(item.name) : selectedValues === item.name}
                                    onChange={(e) => onChange(item.name, e.target.checked)}
                                />
                            )}
                            {/* Bonus: This makes your stars orange! */}
                            <span className={name === "Ratings" ? "text-[#FF9017]" : ""}>{item.name}</span>
                        </label>
                    )
                })}
            </div>

            {/* Only show the button if showSeeMore is true AND there are actually more than 5 items */}
            {showSeeMore && data.length > 5 && (
                <SeeMore isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            )}
        </div>
    )
}

function PriceRange({ onApply }) {
    const MIN = 0;
    const MAX = 99999;

    const [minVal, setMinVal] = useState(MIN);
    const [maxVal, setMaxVal] = useState(MAX);

    const handleMinChange = (e) => {
        const val = Number(e.target.value);
        const clamped = Math.min(val, maxVal - 1);
        setMinVal(clamped);
    };


    const handleMaxChange = (e) => {
        const val = Number(e.target.value);
        const clamped = Math.max(val, minVal + 1);
        setMaxVal(clamped);
    };

    const handleApply = () => {
        if (onApply) {
            onApply({ min: minVal, max: maxVal });
        }
    };

    return (
        <div className="border-t border-gray-300 py-4 w-[240px]">
            <button className="flex justify-between items-center w-full px-6 font-semibold text-gray-900">
                <span>Price range</span>
                <ChevronUp size={20} />
            </button>

            <div className="px-6 mt-6 relative h-10">
                <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-1 bg-gray-200 rounded z-0">
                    <div
                        className="absolute h-full bg-blue-500 rounded z-10"
                        style={{
                            left: `${(minVal / MAX) * 100}%`,
                            right: `${100 - (maxVal / MAX) * 100}%`
                        }}
                    />
                </div>

                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={minVal}
                    onChange={handleMinChange}
                    className="absolute w-[calc(100%-3rem)] left-6 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full z-20 cursor-pointer"
                />

                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={maxVal}
                    onChange={handleMaxChange}
                    className="absolute w-[calc(100%-3rem)] left-6 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full z-30 cursor-pointer"
                />
            </div>

            {/* Inputs Box */}
            <div className="flex gap-4 px-6 mt-2">
                <div className="flex flex-col w-1/2">
                    <label className="text-sm text-gray-600 mb-1">Min</label>
                    <input
                        type="number"
                        value={minVal}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            const clamped = Math.max(MIN, Math.min(val, maxVal - 1));
                            setMinVal(clamped);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm outline-none focus:border-blue-500"
                        placeholder="0"
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <label className="text-sm text-gray-600 mb-1">Max</label>
                    <input
                        type="number"
                        value={maxVal}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            const clamped = Math.min(MAX, Math.max(val, minVal + 1))
                            setMaxVal(clamped);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm outline-none focus:border-blue-500"
                        placeholder="9999"
                    />
                </div>
            </div>

            {/* Apply Button */}
            <div className="px-6 mt-4">
                <button
                    onClick={handleApply}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 text-blue-600 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}

function ProductCard({ image, price, discountedPrice, title, rating, description }) {
    return (
        <div
            className='h-[405px] bg-white border border-gray-200 rounded-md p-4 flex flex-col hover:shadow-md transition-shadow group'>
            <div className='h-[230px] w-full flex items-center justify-center mb-4 p-2'>
                {image ? (
                    <img
                        src={image}
                        alt={title || "Product"}
                        className='w-full h-full object-contain'
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
                        No Image
                    </div>
                )}
            </div>
            <div className='flex flex-col mt-auto pt-3 border-t border-gray-100'>
                <div className='flex justify-between items-start mb-2'>
                    <div className="flex gap-2 items-baseline">
                        <span className='font-bold text-lg text-gray-900'>${discountedPrice}</span>
                        <span className='text-sm text-gray-400 line-through'>${price}</span>
                    </div>
                    <button
                        className='p-2 text-blue-500 rounded border border-gray-200 hover:bg-blue-50 transition-colors'>
                        <Heart size={18} />
                    </button>
                </div>
                <Rating value={Number(rating) / 2} precision={0.5} readOnly size="small" />
                <p className='text-gray-600 text-[15px] leading-snug line-clamp-2'>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default CategoryPage
