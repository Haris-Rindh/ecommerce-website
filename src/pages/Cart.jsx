import React from 'react'
import { Lock, MessageSquare, Truck, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalState';

const Add_to_Cart = () => {
    const { cart, saved, clearCart } = useGlobalContext();

    const subtotal = cart.reduce((acc, item) => acc + (item.currentPrice * item.qty), 0);
    const discount = subtotal > 500 ? 60 : 0;
    const tax = subtotal * 0.05; 
    const total = subtotal - discount + tax;

    return (
        <div className='mx-auto my-4 md:my-8 max-w-[1180px] w-full font-sans px-0 md:px-4'>
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 mb-2">
                <div className="flex items-center gap-2">
                    <Link to="/" className="text-gray-800"><ArrowLeft size={20} /></Link>
                    <span className="font-semibold text-[17px] text-gray-900">Shopping cart</span>
                </div>
            </div>

            <h3 className="hidden md:block text-[24px] font-semibold text-gray-900 mb-6 px-4 md:px-0">
                My cart ({cart.length})
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 md:gap-6 px-4 md:px-0">
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">

                        {cart.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 text-lg">Your cart is empty.</div>
                        ) : (
                            cart.map((item) => <CartItemRow key={item.id} item={item} />)
                        )}

                        <div className="p-5 flex justify-between items-center border-t border-gray-200">
                            <Link to="/category/smartphones" className="flex items-center gap-2 bg-[#0D6EFD] text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                                <ArrowLeft size={20} /> Back to shop
                            </Link>
                            <button onClick={clearCart} className="px-5 py-2 text-[#0D6EFD] font-medium border border-gray-300 rounded-md hover:bg-blue-50 transition-colors bg-white">
                                Remove all
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-10 mt-2">
                        <Feature icon={<Lock className="text-gray-500" size={20} />} title="Secure payment" subtitle="Have you ever finally just" />
                        <Feature icon={<MessageSquare className="text-gray-500" size={20} />} title="Customer support" subtitle="Have you ever finally just" />
                        <Feature icon={<Truck className="text-gray-500" size={20} />} title="Free delivery" subtitle="Have you ever finally just" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <p className="text-[15px] text-gray-600 mb-2">Have a coupon?</p>
                        <div className="flex">
                            <input type="text" placeholder="Add coupon" className='flex-1 border border-gray-300 border-r-0 rounded-l-md px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors' />
                            <button className="px-4 py-2 text-[#0D6EFD] border border-gray-300 rounded-r-md text-sm font-medium hover:bg-gray-50 transition-colors bg-white">Apply</button>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3 text-[15px] text-gray-600">
                            <span className="font-medium">Subtotal:</span>
                            <span className="text-gray-800 font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3 text-[15px] text-gray-600">
                            <span className="font-medium">Discount:</span>
                            <span className="text-[#FA3434] font-medium">- ${discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-5 text-[15px] text-gray-600">
                            <span className="font-medium">Tax:</span>
                            <span className="text-[#00B517] font-medium">+ ${tax.toFixed(2)}</span>
                        </div>
                        <hr className="border-gray-200 mb-4" />
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-semibold text-gray-900 text-[16px]">Total:</span>
                            <span className="font-bold text-[20px] text-gray-900">${total.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="block w-full text-center bg-[#00B517] text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors text-[16px] mb-4 shadow-sm">
                            Checkout
                        </Link>
                        <div className="flex justify-center gap-2 items-center">
                            <div className="w-9 h-6 border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-blue-900">AMEX</div>
                            <div className="w-9 h-6 border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-blue-500">MC</div>
                            <div className="w-9 h-6 border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-blue-600">PayPal</div>
                            <div className="w-9 h-6 border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-blue-800">VISA</div>
                        </div>
                    </div>
                </div>
            </div>

            {saved.length > 0 && (
                <div className="w-full bg-white border border-gray-200 rounded-lg p-4 md:p-5 mt-4 md:mt-8 shadow-sm mx-4 md:mx-0 w-[calc(100%-32px)] md:w-full">
                    <h4 className="text-[18px] md:text-[20px] font-semibold text-gray-900 mb-4 md:mb-5">Saved for later</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                        {saved.map((product) => <SavedItemCard key={product.id} product={product} />)}
                    </div>
                </div>
            )}
        </div>
    )
}

function CartItemRow({ item }) {
    const { removeFromCart, updateQty, toggleSaved } = useGlobalContext();

    return (
        <div className="p-4 md:p-5 flex gap-3 md:gap-4 border-b border-gray-200 last:border-b-0">
            <div className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] border border-gray-200 bg-[#F7F7F7] rounded-md flex items-center justify-center p-2 shrink-0">
                <img src={item.images?.[0] || item.image} alt={item.title} className="max-w-full max-h-full mix-blend-multiply object-contain" />
            </div>
            <div className="flex flex-col md:flex-row flex-1 justify-between overflow-hidden">
                <div className="flex flex-col">
                    <h4 className="text-[14px] md:text-[16px] text-gray-900 font-medium leading-tight mb-1 truncate">{item.title}</h4>
                    <span className="text-[13px] md:text-[14px] text-[#8B96A5] mb-0.5 truncate">Category: {item.category || "General"}</span>
                    <span className="text-[13px] md:text-[14px] text-[#8B96A5] mb-2 md:mb-3 truncate">Seller: Artel Market</span>

                    <div className="hidden md:flex gap-2 mt-auto">
                        <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 text-[13px] font-medium text-[#FA3434] border border-gray-200 rounded hover:bg-blue-50 transition-colors shadow-sm">Remove</button>
                        <button onClick={() => { toggleSaved(item); removeFromCart(item.id); }} className="px-3 py-1 text-[13px] font-medium text-[#0D6EFD] border border-gray-200 rounded hover:bg-blue-50 transition-colors shadow-sm">Save for later</button>
                    </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between mt-2 md:mt-0">
                    <span className="text-[16px] font-bold text-gray-900">${item.currentPrice.toFixed(2)}</span>
                    <select value={item.qty} onChange={(e) => updateQty(item.id, e.target.value)} className="border border-gray-300 text-gray-700 text-[13px] md:text-[14px] rounded px-2 md:px-3 py-1 md:py-1.5 outline-none focus:border-blue-500 cursor-pointer shadow-sm">
                        <option value={1}>Qty: 1</option><option value={2}>Qty: 2</option><option value={3}>Qty: 3</option><option value={4}>Qty: 4</option><option value={5}>Qty: 5</option>
                    </select>
                </div>
                <div className="flex md:hidden gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => removeFromCart(item.id)} className="flex-1 py-1.5 text-[12px] font-medium text-[#FA3434] border border-gray-200 rounded hover:bg-blue-50 transition-colors shadow-sm">Remove</button>
                    <button onClick={() => { toggleSaved(item); removeFromCart(item.id); }} className="flex-1 py-1.5 text-[12px] font-medium text-[#0D6EFD] border border-gray-200 rounded hover:bg-blue-50 transition-colors shadow-sm">Save for later</button>
                </div>
            </div>
        </div>
    )
}

function SavedItemCard({ product }) {
    const { moveToCart } = useGlobalContext();
    return (
        <div className="flex flex-col cursor-pointer group rounded-lg overflow-hidden border border-gray-200 bg-white">
            <Link to={`/product/${product.id}`} className="w-full h-[150px] md:h-[240px] bg-[#EEEEEE] flex items-center justify-center p-4 md:p-6 overflow-hidden border-b border-gray-200">
                <img src={product.images?.[0] || product.image} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <div className="p-3 md:p-4">
                <p className="text-[16px] md:text-[18px] text-gray-900 font-bold leading-tight mb-1">${product.currentPrice.toFixed(2)}</p>
                <Link to={`/product/${product.id}`} className="text-[13px] md:text-[15px] text-[#8B96A5] leading-snug mb-3 md:mb-4 line-clamp-2">{product.title}</Link>
                <button onClick={() => moveToCart(product)} className="w-full xl:w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center justify-center gap-1 text-[13px] md:text-[15px] text-[#0D6EFD] font-medium border border-gray-300 hover:bg-blue-50 transition-colors bg-white shadow-sm truncate">
                    <ShoppingCart size={16} className="text-[#0D6EFD] shrink-0" /> Move to cart
                </button>
            </div>
        </div>
    )
}

function Feature({ icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">{icon}</div>
            <div className="flex flex-col"><span className="text-[15px] font-medium text-gray-800 leading-tight">{title}</span><span className="text-[14px] text-[#8B96A5] leading-tight">{subtitle}</span></div>
        </div>
    )
}

export default Add_to_Cart;