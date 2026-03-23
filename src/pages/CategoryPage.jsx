import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronUp, ChevronDown, LayoutGrid, List, Heart, Filter } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { useGlobalContext } from '../context/GlobalState';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase';

const CategoryList = [
    { name: "Mobile accessory", path: "/category/mobile-accessory" },
    { name: "Electronics", path: "/category/electronics" },
    { name: "Smartphones", path: "/category/smartphones" },
    { name: "Modern tech", path: "/category/modern-tech" }
];

const ConditionsList = ['Any', 'Refurbished', 'Brand new', 'Old items'];

const DualRangeSlider = ({ min, max, setPriceRange }) => {
    const MAX_SLIDER_VALUE = 99999; 
    
    const leftPercent = Math.min(Math.max((Number(min || 0) / MAX_SLIDER_VALUE) * 100, 0), 100);
    const rightPercent = Math.min(Math.max(100 - (Number(max || MAX_SLIDER_VALUE) / MAX_SLIDER_VALUE) * 100, 0), 100);

    return (
        <div className="relative w-full h-6 flex items-center mb-3 mt-1">
            <div className="absolute w-full h-[3px] bg-gray-200 rounded"></div>
            <div className="absolute h-[3px] bg-blue-600 rounded z-10" style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}></div>
            
            <input 
                type="range" min="0" max={MAX_SLIDER_VALUE} 
                value={min || 0} 
                onChange={e => setPriceRange(prev => ({...prev, min: Math.min(Number(e.target.value), Number(prev.max || MAX_SLIDER_VALUE) - 10)}))} 
                className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab z-20" 
            />
            <input 
                type="range" min="0" max={MAX_SLIDER_VALUE} 
                value={max || MAX_SLIDER_VALUE} 
                onChange={e => setPriceRange(prev => ({...prev, max: Math.max(Number(e.target.value), Number(prev.min || 0) + 10)}))} 
                className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab z-20" 
            />
        </div>
    );
};

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { toggleSaved, saved } = useGlobalContext();
    
    const isAllCategories = !categoryName || categoryName.toLowerCase() === 'all';
    const displayCategory = isAllCategories ? "All Categories" : categoryName.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    const [view, setView] = useState("list");
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState({ name: "Featured" });
    
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [availableBrands, setAvailableBrands] = useState([]);
    const [availableFeatures, setAvailableFeatures] = useState([]);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [appliedPrice, setAppliedPrice] = useState({ min: '', max: '' });
    const [condition, setCondition] = useState('Any');
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    const [openSections, setOpenSections] = useState({ category: true, brands: true, features: true, price: true, condition: true, ratings: true });
    const [showAllBrands, setShowAllBrands] = useState(false);
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let q = collection(db, "products");
                if (!isAllCategories) {
                    q = query(collection(db, "products"), where("categorySlug", "==", categoryName));
                }
                const snap = await getDocs(q);
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(data);
                
                setAvailableBrands([...new Set(data.map(p => p.brand).filter(Boolean))]);
                
                const featuresSet = new Set();
                data.forEach(p => { if (Array.isArray(p.features)) p.features.forEach(f => featuresSet.add(f)); });
                setAvailableFeatures(Array.from(featuresSet));

            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        setSelectedBrands([]); setSelectedFeatures([]); setPriceRange({ min: '', max: '' }); setAppliedPrice({ min: '', max: '' }); 
        setCondition('Any'); setSelectedRatings([]); setVerifiedOnly(false); setCurrentPage(1);
        fetchProducts();
    }, [categoryName, isAllCategories]);

    useEffect(() => {
        let result = [...products];

        if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
        if (selectedFeatures.length > 0) result = result.filter(p => p.features && selectedFeatures.some(f => p.features.includes(f)));
        if (appliedPrice.min !== '') result = result.filter(p => Number(p.price) >= Number(appliedPrice.min));
        if (appliedPrice.max !== '') result = result.filter(p => Number(p.price) <= Number(appliedPrice.max));
        if (condition !== 'Any') result = result.filter(p => p.condition === condition);
        if (verifiedOnly) result = result.filter(p => p.verified === true || Number(p.rating || 0) >= 4);
        
        if (selectedRatings.length > 0) {
            const minSelectedStar = Math.min(...selectedRatings);
            result = result.filter(p => Number(p.rating || 0) >= minSelectedStar);
        }

        if (selectedFilter.name === "Price: Low to High") result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        else if (selectedFilter.name === "Price: High to Low") result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [products, selectedBrands, selectedFeatures, appliedPrice, condition, selectedRatings, verifiedOnly, selectedFilter]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSection = (section) => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

    const handleSeeAll = (type) => {
        if (type === 'brands') {
            const isExpanding = !showAllBrands;
            setShowAllBrands(isExpanding);
            if (isExpanding) setOpenSections({ category: false, brands: true, features: false, price: false, condition: false, ratings: false });
            else setOpenSections({ category: true, brands: true, features: true, price: true, condition: true, ratings: true });
        } else if (type === 'features') {
            const isExpanding = !showAllFeatures;
            setShowAllFeatures(isExpanding);
            if (isExpanding) setOpenSections({ category: false, brands: false, features: true, price: false, condition: false, ratings: false });
            else setOpenSections({ category: true, brands: true, features: true, price: true, condition: true, ratings: true });
        }
    };

    const toggleArrayFilter = (state, setState, item) => setState(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

    const clearAllFilters = () => {
        setSelectedBrands([]); setSelectedFeatures([]); setCondition('Any'); setSelectedRatings([]);
        setPriceRange({ min: '', max: '' }); setAppliedPrice({ min: '', max: '' }); setVerifiedOnly(false);
    };

    return (
        <div className='mx-auto max-w-[1180px] py-6 font-sans px-4'>
            <div className='flex items-center gap-2 text-gray-500 text-sm mb-6'>
                <Link to="/" className='hover:text-blue-600 transition-colors'>Home</Link>
                <ChevronRight size={16} />
                <span className='text-gray-900 font-medium'>{displayCategory}</span>
            </div>

            <div className='flex flex-col md:flex-row gap-0 md:gap-6 mx-[-16px] md:mx-0 px-4 md:px-0'>
                {isMobileSidebarOpen && (
                     <div className="md:hidden">
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileSidebarOpen(false)} />
                     </div>
                )}
                
                <aside className={`w-full md:w-[240px] shrink-0 flex flex-col gap-1 ${isMobileSidebarOpen ? 'fixed top-0 right-0 bottom-0 w-[280px] z-50 bg-white p-4 overflow-y-auto block shadow-xl transition-transform animate-slide-in-right' : 'hidden md:flex'}`}>
                    {isMobileSidebarOpen && (
                        <div className="flex md:hidden items-center justify-between mb-4 pb-2 border-b border-gray-200">
                             <h3 className="font-bold text-lg">Filters</h3>
                             <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl leading-none">&times;</button>
                        </div>
                    )}
                    <div className='flex flex-col border-t border-gray-200 pt-4 pb-2'>
                        <button onClick={() => toggleSection('category')} className='flex items-center justify-between w-full pb-3 font-semibold text-[16px] text-gray-900 leading-snug outline-none'>
                            Category <ChevronUp size={20} className={`text-gray-500 transition-transform ${openSections.category ? '' : 'rotate-180'}`} />
                        </button>
                        {openSections.category && (
                            <div className='max-h-48 overflow-y-auto flex flex-col gap-2.5'>
                                {CategoryList.map((item, idx) => <Link key={idx} to={item.path} className="text-[15px] text-gray-600 hover:text-blue-600 block w-full text-left">{item.name}</Link>)}
                                <button className='text-left pt-1 text-[14px] font-medium text-blue-600 hover:underline'>See all</button>
                            </div>
                        )}
                    </div>

                    {availableBrands.length > 0 && (
                        <div className='flex flex-col border-t border-gray-200 pt-4 pb-2'>
                            <button onClick={() => toggleSection('brands')} className='flex items-center justify-between w-full pb-3 font-semibold text-[16px] text-gray-900 leading-snug outline-none'>
                                Brands <ChevronUp size={20} className={`text-gray-500 transition-transform ${openSections.brands ? '' : 'rotate-180'}`} />
                            </button>
                            {openSections.brands && (
                                <div className='flex flex-col'>
                                    <div className={`flex flex-col gap-2.5 ${showAllBrands ? 'max-h-72 overflow-y-auto pr-2' : ''}`}>
                                        {availableBrands.slice(0, showAllBrands ? undefined : 5).map((brand, idx) => (
                                            <label key={idx} className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600">
                                                <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleArrayFilter(selectedBrands, setSelectedBrands, brand)} className='w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer' />
                                                <span className="text-[15px]">{brand}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {availableBrands.length > 5 && (
                                        <button onClick={() => handleSeeAll('brands')} className='text-left pt-2 text-[14px] font-medium text-blue-600 hover:underline'>
                                            {showAllBrands ? "See less" : "See all"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {availableFeatures.length > 0 && (
                        <div className='flex flex-col border-t border-gray-200 pt-4 pb-2'>
                            <button onClick={() => toggleSection('features')} className='flex items-center justify-between w-full pb-3 font-semibold text-[16px] text-gray-900 leading-snug outline-none'>
                                Features <ChevronUp size={20} className={`text-gray-500 transition-transform ${openSections.features ? '' : 'rotate-180'}`} />
                            </button>
                            {openSections.features && (
                                <div className='flex flex-col'>
                                    <div className={`flex flex-col gap-2.5 ${showAllFeatures ? 'max-h-72 overflow-y-auto pr-2' : ''}`}>
                                        {availableFeatures.slice(0, showAllFeatures ? undefined : 5).map((feature, idx) => (
                                            <label key={idx} className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600">
                                                <input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => toggleArrayFilter(selectedFeatures, setSelectedFeatures, feature)} className='w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer' />
                                                <span className="text-[15px]">{feature}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {availableFeatures.length > 5 && (
                                        <button onClick={() => handleSeeAll('features')} className='text-left pt-2 text-[14px] font-medium text-blue-600 hover:underline'>
                                            {showAllFeatures ? "See less" : "See all"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 pb-2">
                        <button onClick={() => toggleSection('price')} className='flex items-center justify-between w-full pb-3 font-semibold text-[16px] text-gray-900 leading-snug outline-none'>
                            Price range <ChevronUp size={20} className={`text-gray-500 transition-transform ${openSections.price ? '' : 'rotate-180'}`} />
                        </button>
                        {openSections.price && (
                            <div className="flex flex-col gap-3">
                                <DualRangeSlider min={priceRange.min} max={priceRange.max} setPriceRange={setPriceRange} />
                                <div className="flex items-center gap-2">
                                    <div className="flex-1"><label className="text-xs text-gray-500 mb-1 block">Min</label><input type="number" placeholder="0" value={priceRange.min} onChange={e => setPriceRange({...priceRange, min: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white" /></div>
                                    <div className="flex-1"><label className="text-xs text-gray-500 mb-1 block">Max</label><input type="number" placeholder="99999" value={priceRange.max} onChange={e => setPriceRange({...priceRange, max: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white" /></div>
                                </div>
                                <button onClick={() => setAppliedPrice(priceRange)} className="w-full bg-white border border-gray-300 rounded py-1.5 text-blue-600 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">Apply</button>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col border-t border-gray-200 pt-4 pb-2'>
                        <button onClick={() => toggleSection('condition')} className='flex items-center justify-between w-full pb-3 font-semibold text-[16px] text-gray-900 leading-snug outline-none'>
                            Condition <ChevronUp size={20} className={`text-gray-500 transition-transform ${openSections.condition ? '' : 'rotate-180'}`} />
                        </button>
                        {openSections.condition && (
                            <div className='flex flex-col gap-2.5'>
                                {ConditionsList.map((cond, idx) => (
                                    <label key={idx} className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600">
                                        <input type="radio" name="conditionGroup" checked={condition === cond} onChange={() => setCondition(cond)} className='w-4 h-4 border-gray-300 accent-blue-600 cursor-pointer' />
                                        <span className="text-[15px]">{cond}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col border-t border-gray-200 pt-4 pb-2'>
                        <button onClick={() => toggleSection('ratings')} className='flex items-center justify-between w-full pb-3 font-semibold text-[16px] text-gray-900 leading-snug outline-none'>
                            Ratings <ChevronUp size={20} className={`text-gray-500 transition-transform ${openSections.ratings ? '' : 'rotate-180'}`} />
                        </button>
                        {openSections.ratings && (
                            <div className='flex flex-col gap-2.5'>
                                {[5, 4, 3, 2].map(star => (
                                    <label key={star} className="flex items-center gap-2 cursor-pointer text-gray-700">
                                        <input type="checkbox" checked={selectedRatings.includes(star)} onChange={() => toggleArrayFilter(selectedRatings, setSelectedRatings, star)} className='w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer' />
                                        <Rating value={star} readOnly size="small" sx={{ color: '#FF9017' }} />
                                        {star < 5 && <span className="text-[15px] text-gray-600">& up</span>}
                                    </label>
                                ))}
                                <button onClick={() => setSelectedRatings([])} className="text-sm text-blue-600 text-left mt-1 hover:underline">Clear Rating Filter</button>
                            </div>
                        )}
                    </div>
                </aside>

                <main className="flex-1 w-full overflow-hidden mt-4 md:mt-0">
                    <div className="p-3 mb-4 bg-white border border-gray-200 md:rounded-md flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-3 mx-[-16px] md:mx-0 px-4 md:px-3">
                        <span className="hidden md:inline text-gray-900 text-[15px]">{filteredProducts.length} items in <strong>{displayCategory}</strong></span>
                        <div className='flex justify-between md:justify-end gap-2 md:gap-4 items-center w-full md:w-auto'>
                            
                            {/* Mobile Controls */}
                            <div className="flex gap-2 items-center md:hidden flex-1">
                                <button onClick={() => setIsFilterBoxOpen(!isFilterBoxOpen)} className="flex-1 px-2 py-1.5 flex items-center justify-center gap-1 border border-gray-300 rounded text-gray-700 bg-white text-[13px] font-medium">
                                    Sort: {selectedFilter.name.split(':')[0]} <ChevronDown size={14} />
                                </button>
                                <button onClick={() => setIsMobileSidebarOpen(true)} className="flex-1 px-2 py-1.5 flex items-center justify-center gap-1 border border-gray-300 rounded text-gray-700 bg-white text-[13px] font-medium">
                                    Filter <Filter size={14} />
                                </button>
                            </div>

                            <label className="hidden sm:flex items-center cursor-pointer text-gray-700 hover:text-blue-600 text-sm">
                                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="mr-2 w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                                <span>Verified only</span>
                            </label>
                            <div className="relative hidden sm:block">
                                <button onClick={() => setIsFilterBoxOpen(!isFilterBoxOpen)} className="px-3 py-1.5 flex items-center justify-between w-40 gap-2 border border-gray-300 rounded-md text-gray-700 hover:text-gray-900 transition-colors bg-white">
                                    <span className="text-[14px] font-medium">{selectedFilter.name}</span>
                                    <ChevronDown size={16} className={`transform transition-transform ${isFilterBoxOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {isFilterBoxOpen && (
                                <div className="absolute top-[80px] md:top-auto right-4 md:right-28 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden flex flex-col z-20">
                                    {[{name: "Featured"}, {name: "Price: Low to High"}, {name: "Price: High to Low"}].map((option, idx) => (
                                        <button key={idx} onClick={() => { setSelectedFilter(option); setIsFilterBoxOpen(false); }} className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 text-sm text-gray-700 transition-colors text-left">{option.name}</button>
                                    ))}
                                </div>
                            )}
                            <div className='flex rounded border border-gray-300 overflow-hidden shrink-0'>
                                <button onClick={() => setView("grid")} className={`p-1 md:p-1.5 ${view === "grid" ? "bg-gray-200" : "bg-white"} hover:bg-gray-100 transition-colors`}><LayoutGrid size={18} className="text-gray-700" /></button>
                                <button onClick={() => setView("list")} className={`p-1 md:p-1.5 ${view === "list" ? "bg-gray-200" : "bg-white"} hover:bg-gray-100 transition-colors`}><List size={18} className="text-gray-700" /></button>
                            </div>
                        </div>
                    </div>

                    {(selectedBrands.length > 0 || selectedFeatures.length > 0 || selectedRatings.length > 0 || condition !== 'Any' || appliedPrice.min !== '') && (
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            {selectedBrands.map((brand) => <span key={brand} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-blue-600 text-[13px] flex items-center gap-2 shadow-sm">{brand} <button onClick={() => toggleArrayFilter(selectedBrands, setSelectedBrands, brand)} className="hover:text-red-500 font-bold">×</button></span>)}
                            {selectedFeatures.map((feature) => <span key={feature} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-blue-600 text-[13px] flex items-center gap-2 shadow-sm">{feature} <button onClick={() => toggleArrayFilter(selectedFeatures, setSelectedFeatures, feature)} className="hover:text-red-500 font-bold">×</button></span>)}
                            <button onClick={clearAllFilters} className="text-gray-500 text-sm font-medium hover:text-red-500 hover:underline ml-2">Clear all filters</button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="w-full py-20 flex items-center justify-center text-lg text-gray-500 font-medium">Loading products...</div>
                    ) : paginatedProducts.length === 0 ? (
                        <div className="w-full py-20 text-center text-gray-500 text-lg bg-white border border-gray-200 rounded-md shadow-sm">No products match your selected filters.</div>
                    ) : (
                        <div className={view === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5' : 'flex flex-col gap-4'}>
                            {paginatedProducts.map((product) => <ProductCard key={product.id} product={product} view={view} saved={saved} toggleSaved={toggleSaved} />)}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-end gap-4 mt-8 mb-10">
                            <div className="flex items-center border border-gray-300 rounded px-3 py-1.5 bg-white shadow-sm">
                                <span className="text-gray-600 text-sm mr-3">Show</span>
                                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-transparent outline-none text-sm font-medium text-gray-800 cursor-pointer">
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <div className="flex items-center rounded border border-gray-300 bg-white overflow-hidden shadow-sm font-medium text-sm">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-600 transition-colors">&lt;</button>
                                {(() => {
                                    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
                                    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
                                    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
                                })().map((num, idx) => (
                                    num === "..." ? (
                                        <span key={`dots-${idx}`} className="px-3 py-2 border-r border-gray-300 text-gray-400">...</span>
                                    ) : (
                                        <button key={num} onClick={() => setCurrentPage(num)} className={`px-4 py-2 border-r border-gray-300 transition-colors ${currentPage === num ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>{num}</button>
                                    )
                                ))}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 hover:bg-gray-50 disabled:opacity-50 text-gray-600 transition-colors">&gt;</button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

function ProductCard({ product, view, saved, toggleSaved }) {
    const isSaved = saved.some(item => item.id === product.id);
    const imgSource = product.image || product.images?.[0];

    if (view === 'list') {
        return (
            <Link to={`/product/${product.id}`} className='bg-white border rounded-md border-gray-200 p-3 md:p-4 flex gap-3 md:gap-6 hover:shadow-md transition-shadow group relative mx-[-16px] md:mx-0 rounded-none md:rounded-md'>
                <div className='h-[120px] w-[120px] md:h-[200px] md:w-[200px] shrink-0 flex items-center justify-center p-2 bg-gray-50 rounded'>
                    {imgSource ? <img src={imgSource} alt={product.title} className='max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform' /> : <div className="text-gray-400 text-xs text-center border p-2">No Image</div>}
                </div>
                <div className='flex flex-col flex-1 py-1 md:py-2 pr-0 md:pr-10 min-w-0'>
                    <h3 className="text-[14px] md:text-lg font-medium text-gray-900 mb-1 md:mb-2 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">{product.title}</h3>
                    <div className="flex gap-2 md:gap-3 items-center mb-1 md:mb-2 flex-wrap">
                        <span className='font-bold text-base md:text-xl text-gray-900'>${Number(product.discountedPrice || product.price).toFixed(2)}</span>
                        {product.discountedPrice && <span className='text-[12px] md:text-sm text-gray-400 line-through'>${Number(product.price).toFixed(2)}</span>}
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4 text-[12px] md:text-sm text-gray-500 flex-wrap">
                        <div className="flex items-center gap-1"><Rating value={parseFloat(product.rating) || 0} precision={0.5} readOnly size="small" sx={{ color: '#FF9017', fontSize: '1rem' }}/><span className="text-[#FF9017] font-medium ml-0.5">{product.rating || 0}</span></div>
                        <span className="hidden md:inline">• 154 orders</span><span className="text-green-500 font-medium whitespace-nowrap">Free Shipping</span>
                    </div>
                    <p className='hidden md:block text-gray-600 text-[15px] leading-relaxed line-clamp-2 max-w-2xl'>{product.description || "Premium item sourced from global suppliers."}</p>
                    <Link to={`/product/${product.id}`} className="hidden md:block text-blue-600 font-medium text-[15px] hover:underline mt-auto">View details</Link>
                    <button onClick={(e) => { e.preventDefault(); toggleSaved(product); }} className={`absolute top-3 right-3 md:top-6 md:right-6 p-1.5 md:p-2 rounded border flex items-center gap-2 transition-colors z-10 ${isSaved ? 'text-blue-500 bg-blue-50 border-blue-200' : 'text-gray-400 border-gray-200 hover:bg-blue-50 hover:text-blue-500'}`}><Heart size={16} fill={isSaved ? "currentColor" : "none"} className="md:w-[18px] md:h-[18px]"/></button>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/product/${product.id}`} className='h-[405px] bg-white border border-gray-200 rounded-md p-4 flex flex-col hover:shadow-md transition-shadow group relative'>
            <div className='h-[230px] w-full flex items-center justify-center mb-4 p-2 bg-white rounded'>
                {imgSource ? <img src={imgSource} alt={product.title} className='max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform' /> : <div className="text-gray-400 text-sm">No Image</div>}
            </div>
            <div className='flex flex-col mt-auto pt-3 border-t border-gray-100'>
                <div className='flex justify-between items-start mb-2'>
                    <div className="flex gap-2 items-baseline flex-wrap">
                        <span className='font-bold text-lg text-gray-900'>${Number(product.discountedPrice || product.price).toFixed(2)}</span>
                        {product.discountedPrice && <span className='text-sm text-gray-400 line-through'>${Number(product.price).toFixed(2)}</span>}
                    </div>
                    <button onClick={(e) => { e.preventDefault(); toggleSaved(product); }} className={`p-2 rounded border transition-colors z-10 ${isSaved ? 'text-blue-500 bg-blue-50 border-blue-200' : 'text-gray-400 border-gray-200 hover:bg-blue-50 hover:text-blue-500'}`}><Heart size={18} fill={isSaved ? "currentColor" : "none"} /></button>
                </div>
                <div className="flex items-center gap-1 mb-1"><Rating value={parseFloat(product.rating) || 0} precision={0.5} readOnly size="small" sx={{ color: '#FF9017' }}/></div>
                <p className='text-gray-600 text-[14px] leading-snug line-clamp-2'>{product.title}</p>
            </div>
        </Link>
    )
}

export default CategoryPage;