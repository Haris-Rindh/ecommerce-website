import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore'; 
import { db } from '../../firebase';
import { useGlobalContext } from '../../context/GlobalState';
import { useToast } from '../../context/ToastContext';
import { PlusCircle, Package, Settings, LayoutDashboard, Link as LinkIcon, Edit, Trash2, List, Eye, ArrowLeft, Truck, UploadCloud } from 'lucide-react';

const CATEGORIES = [
    { name: "Automobiles", slug: "automobiles" },
    { name: "Clothes and wear", slug: "clothes-and-wear" },
    { name: "Home interiors", slug: "home-interiors" },
    { name: "Electronics", slug: "electronics" },
    { name: "Computer and tech", slug: "computer-and-tech" },
    { name: "Tools, equipment", slug: "tools" },
    { name: "Sports and outdoors", slug: "sports" },
    { name: "Animal and pets", slug: "pets" },
    { name: "Machinery tools", slug: "machinery" }
];

const emptyForm = { title: '', price: '', discountedPrice: '', imageURLs: '', categorySlug: 'electronics', brand: '', condition: 'Brand new', rating: '5.0', description: '', features: '' };

const AdminDashboard = () => {
    const { user, isAuthLoading } = useGlobalContext();
    const showToast = useToast();

    const [activeTab, setActiveTab] = useState('manage_products'); 
    
    // Product States
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [editingProductId, setEditingProductId] = useState(null); 
    const [allProducts, setAllProducts] = useState([]);

    // NEW: Bulk Import State
    const [bulkJson, setBulkJson] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    // Order States
    const [allOrders, setAllOrders] = useState([]);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'orders') {
                    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
                    const snap = await getDocs(q);
                    setAllOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } else if (activeTab === 'manage_products') {
                    const q = query(collection(db, "products"));
                    const snap = await getDocs(q);
                    setAllProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }
            } catch (err) {
                console.error(err);
                showToast("Failed to fetch data.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        setViewingOrder(null); 
        fetchData();
    }, [activeTab, showToast]);

    // --- PRODUCT MANAGEMENT ---

    const handleEditClick = (product) => {
        const featuresString = Array.isArray(product.features) ? product.features.join(', ') : (product.features || '');
        const imagesString = product.images ? product.images.join(', ') : (product.image || '');

        setFormData({
            title: product.title || '',
            price: product.price || '',
            discountedPrice: product.discountedPrice || '',
            imageURLs: imagesString,
            categorySlug: product.categorySlug || 'electronics',
            brand: product.brand || '',
            condition: product.condition || 'Brand new',
            rating: product.rating || '5.0',
            description: product.description || '',
            features: featuresString
        });
        setEditingProductId(product.id);
        setActiveTab('add_product'); 
        window.scrollTo(0,0);
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== "");
            const imagesArray = formData.imageURLs.split(',').map(url => url.trim()).filter(url => url !== "");

            const productData = { 
                ...formData, 
                price: Number(formData.price), 
                discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : null, 
                features: featuresArray,
                images: imagesArray, 
                image: imagesArray[0] || '' 
            };
            delete productData.imageURLs; 

            if (editingProductId) {
                await updateDoc(doc(db, "products", editingProductId), productData);
                showToast("Product updated successfully!", "success");
                setActiveTab('manage_products'); 
            } else {
                await addDoc(collection(db, "products"), productData);
                showToast("Success! Product published to store.", "success");
            }
            
            setFormData(emptyForm);
            setEditingProductId(null);
        } catch (error) {
            console.error(error);
            showToast("Failed to save product.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
        try {
            await deleteDoc(doc(db, "products", productId));
            setAllProducts(allProducts.filter(p => p.id !== productId));
            showToast("Product deleted successfully.", "info");
        } catch (error) {
            showToast("Failed to delete product.", "error");
        }
    };

    // ---  BULK IMPORT FUNCTION ---
    const handleBulkImport = async () => {
        if (!bulkJson.trim()) return showToast("Please paste your JSON data first.", "error");
        
        setIsImporting(true);
        try {
            const parsedProducts = JSON.parse(bulkJson);
            
            if (!Array.isArray(parsedProducts)) {
                throw new Error("Your data must be wrapped in an array [ ... ]");
            }

            const batch = writeBatch(db);
            let addedCount = 0;

            parsedProducts.forEach((item) => {
                const newDocRef = doc(collection(db, "products")); 
                
                const featuresArray = item.features ? item.features.split(',').map(f=>f.trim()) : [];
                const imagesArray = item.imageURLs ? item.imageURLs.split(',').map(u=>u.trim()) : [item.image || ''];

                const cleanProduct = {
                    title: item.title || 'Untitled Product',
                    price: Number(item.price) || 0,
                    discountedPrice: item.discountedPrice ? Number(item.discountedPrice) : null,
                    categorySlug: item.categorySlug || 'electronics',
                    brand: item.brand || '',
                    condition: item.condition || 'Brand new',
                    rating: item.rating || '5.0',
                    description: item.description || '',
                    features: featuresArray,
                    images: imagesArray.filter(i=>i),
                    image: imagesArray[0] || ''
                };
                batch.set(newDocRef, cleanProduct);
                addedCount++;
            });

            await batch.commit();
            
            showToast(`Successfully imported ${addedCount} products!`, "success");
            setBulkJson('');
            setActiveTab('manage_products'); 

        } catch (err) {
            console.error(err);
            showToast("Invalid JSON format. Check your syntax! " + err.message, "error");
        } finally {
            setIsImporting(false);
        }
    };

    // --- ORDER MANAGEMENT ---
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateDoc(doc(db, "orders", orderId), { status: newStatus });
            setViewingOrder({ ...viewingOrder, status: newStatus });
            setAllOrders(allOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            showToast(`Order marked as ${newStatus}`, "success");
        } catch (error) {
            showToast("Failed to update status.", "error");
        }
    };

    if (isAuthLoading || !user) return null;

    return (
        <div className="bg-gray-50 min-h-screen font-sans flex flex-col md:flex-row">
            
            <div className="w-full md:w-64 shrink-0 bg-white text-gray-800 md:min-h-screen p-4 md:p-6 flex flex-row overflow-x-auto no-scrollbar md:flex-col gap-2 md:border-r border-gray-200 shadow-sm z-10">
                <div className="hidden md:flex text-2xl font-extrabold text-gray-950 tracking-tight items-center gap-2 mb-2 md:mb-6 border-b border-gray-100 pb-2 md:pb-4">
                    <LayoutDashboard className="text-[#0D6EFD]" /> Admin Panel
                </div>
                <button onClick={() => { setActiveTab('manage_products'); setEditingProductId(null); }} className={`flex items-center gap-2 md:gap-3 px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === 'manage_products' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                    <List size={20} className={`shrink-0 ${activeTab === 'manage_products' ? 'text-blue-600' : 'text-gray-400'}`}/> <span className="text-sm md:text-base">Manage Products</span>
                </button>
                <button onClick={() => { setActiveTab('add_product'); setFormData(emptyForm); setEditingProductId(null); }} className={`flex items-center gap-2 md:gap-3 px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === 'add_product' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                    <PlusCircle size={20} className={`shrink-0 ${activeTab === 'add_product' ? 'text-blue-600' : 'text-gray-400'}`}/> <span className="text-sm md:text-base">{editingProductId ? 'Edit Product' : 'Add Product'}</span>
                </button>
                
                <button onClick={() => { setActiveTab('bulk_import'); setEditingProductId(null); }} className={`flex items-center gap-2 md:gap-3 px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === 'bulk_import' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                    <UploadCloud size={20} className={`shrink-0 ${activeTab === 'bulk_import' ? 'text-blue-600' : 'text-gray-400'}`}/> <span className="text-sm md:text-base">Bulk Import</span>
                </button>

                <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 md:gap-3 px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                    <Package size={20} className={`shrink-0 ${activeTab === 'orders' ? 'text-blue-600' : 'text-gray-400'}`}/> <span className="text-sm md:text-base">Manage Orders</span>
                </button>
            </div>

            <div className="flex-1 p-4 md:p-6 lg:p-10 md:h-screen md:overflow-y-auto w-full">
               
                {activeTab === 'manage_products' && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-8">Manage Inventory</h1>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full">
                           <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 text-sm font-semibold text-gray-800">Product</th>
                                        <th className="p-4 text-sm font-semibold text-gray-800">Price</th>
                                        <th className="p-4 text-sm font-semibold text-gray-800">Category</th>
                                        <th className="p-4 text-sm font-semibold text-gray-800 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? <tr><td colSpan="4" className="p-8 text-center font-medium text-gray-500">Loading products...</td></tr> : 
                                    allProducts.map(product => (
                                        <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 flex items-center gap-3">
                                                <div className="w-10 h-10 shrink-0 bg-white shadow-sm border border-gray-100 rounded flex items-center justify-center p-1"><img src={product.image || product.images?.[0]} alt="" className="max-w-full max-h-full mix-blend-multiply"/></div>
                                                <span className="text-sm font-bold text-gray-900 truncate max-w-[250px]">{product.title}</span>
                                            </td>
                                            <td className="p-4 text-sm font-bold text-gray-900">${product.price?.toFixed(2)}</td>
                                            <td className="p-4 text-sm font-medium text-gray-600 capitalize">{product.categorySlug?.replace('-', ' ')}</td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={() => handleEditClick(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit size={16}/></button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {allProducts.length === 0 && !isLoading && <tr><td colSpan="4" className="p-8 text-center font-medium text-gray-500">No products found.</td></tr>}
                                </tbody>
                            </table>
                           </div>
                        </div>
                    </>
                )}
                {activeTab === 'add_product' && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-8">{editingProductId ? 'Edit Product' : 'Add New Product'}</h1>
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-4xl">
                            <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-800 mb-1.5">Product Title</label><input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-2"><LinkIcon size={16}/> Image URLs (Separate multiple with commas)</label><textarea required rows="2" placeholder="https://image1.jpg, https://image2.jpg" value={formData.imageURLs} onChange={e => setFormData({...formData, imageURLs: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"></textarea></div>
                                <div><label className="block text-sm font-semibold text-gray-800 mb-1.5">Regular Price ($)</label><input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" /></div>
                                <div><label className="block text-sm font-semibold text-gray-800 mb-1.5">Discounted Price ($) <span className="text-xs text-gray-400 font-normal">- Optional</span></label><input type="number" step="0.01" value={formData.discountedPrice} onChange={e => setFormData({...formData, discountedPrice: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-800 mb-1.5">Category</label>
                                    <select value={formData.categorySlug} onChange={e => setFormData({...formData, categorySlug: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition">
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-800 mb-1.5">Features (Comma separated)</label><input type="text" placeholder="Waterproof, Bluetooth 5.0, 1 Year Warranty" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-800 mb-1.5">Description</label><textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"></textarea></div>
                                <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-2">
                                    <button type="submit" disabled={isUploading} className="flex-1 bg-[#0D6EFD] text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 shadow-sm shadow-blue-200">
                                        {isUploading ? "Processing..." : (editingProductId ? "Update Product" : "Publish Product")}
                                    </button>
                                    {editingProductId && (
                                        <button type="button" onClick={() => { setEditingProductId(null); setFormData(emptyForm); setActiveTab('manage_products'); }} className="px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </>
                )}

                {activeTab === 'bulk_import' && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-8">Bulk Import Products</h1>
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-4xl">
                            
                            <div className="mb-6 p-6 bg-blue-50 border border-blue-100 rounded-xl">
                                <h3 className="font-bold text-blue-900 mb-2 text-lg">How to use Bulk Import</h3>
                                <p className="text-sm text-blue-800 mb-4 font-medium">Paste an array of JSON objects into the field below. Ensure your keys match exactly.</p>
                                
                                <div className="bg-white p-4 rounded-lg border border-blue-100 overflow-x-auto relative shadow-sm">
                                    <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-400 uppercase tracking-wider">Example Format</span>
<pre className="text-xs text-gray-700 font-mono mt-2">
{`[
  {
    "title": "Gaming Laptop Pro",
    "price": 1299.99,
    "discountedPrice": 1099.99,
    "imageURLs": "https://img1.jpg, https://img2.jpg",
    "categorySlug": "computer-and-tech",
    "brand": "TechMaster",
    "description": "Powerful gaming laptop with RTX 4080...",
    "features": "16GB RAM, 1TB SSD, 144Hz Display"
  }
]`}
</pre>
                                </div>
                            </div>

                            <textarea
                                rows="12"
                                value={bulkJson}
                                onChange={(e) => setBulkJson(e.target.value)}
                                placeholder="Paste your JSON array here [ { ... }, { ... } ]"
                                className="w-full p-4 border border-gray-300 rounded-xl font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition mb-4 resize-y shadow-sm"
                            ></textarea>

                            <button
                                onClick={handleBulkImport}
                                disabled={isImporting || !bulkJson.trim()}
                                className="w-full bg-[#0D6EFD] text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex justify-center items-center gap-2 shadow-sm shadow-blue-200"
                            >
                                <UploadCloud size={20} />
                                {isImporting ? "Processing Data... Please Wait" : "Start Bulk Import"}
                            </button>
                        </div>
                    </>
                )}

                {activeTab === 'orders' && !viewingOrder && (
                    <>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-8">All Customer Orders</h1>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full">
                          <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-4 text-sm font-semibold text-gray-800">Order ID & Date</th>
                                        <th className="p-4 text-sm font-semibold text-gray-800">Customer</th>
                                        <th className="p-4 text-sm font-semibold text-gray-800">Total</th>
                                        <th className="p-4 text-sm font-semibold text-gray-800">Status</th>
                                        <th className="p-4 text-sm font-semibold text-gray-800 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? <tr><td colSpan="5" className="p-8 text-center font-medium text-gray-500">Loading orders...</td></tr> : 
                                    allOrders.map(order => (
                                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm text-gray-900 font-bold">
                                                #{order.id.slice(0, 8)}<br/>
                                                <span className="text-xs text-gray-500 font-medium">{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}</span>
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800">{order.shippingInfo?.fullName || "Guest"} <br/><span className="text-xs text-gray-500 font-normal">{order.userEmail}</span></td>
                                            <td className="p-4 text-sm font-bold text-gray-900">${order.totalAmount?.toFixed(2)}</td>
                                            <td className="p-4 text-sm">
                                                <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${
                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                                    'bg-orange-50 text-orange-700 border-orange-200'
                                                }`}>
                                                    {order.status || 'Processing'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => setViewingOrder(order)} className="flex items-center justify-end gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold ml-auto transition-colors">
                                                    <Eye size={18}/> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {allOrders.length === 0 && !isLoading && <tr><td colSpan="5" className="p-8 text-center font-medium text-gray-500">No orders received yet.</td></tr>}
                                </tbody>
                            </table>
                          </div>
                        </div>
                    </>
                )}

                {activeTab === 'orders' && viewingOrder && (
                    <div className="max-w-4xl">
                        <button onClick={() => setViewingOrder(null)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold mb-6 transition-colors">
                            <ArrowLeft size={18}/> Back to all orders
                        </button>
                        
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-extrabold text-gray-950 tracking-tight">Order #{viewingOrder.id}</h2>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Placed on {viewingOrder.createdAt?.seconds ? new Date(viewingOrder.createdAt.seconds * 1000).toLocaleString() : 'Recently'}</p>
                                </div>
                                
                                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                    <Truck size={20} className="text-blue-600" />
                                    <select 
                                        value={viewingOrder.status || 'Processing'} 
                                        onChange={(e) => handleUpdateOrderStatus(viewingOrder.id, e.target.value)}
                                        className="bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer appearance-none"
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="In Transit">In Transit</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Customer Details</h3>
                                    <div className="flex flex-col gap-2 text-sm text-gray-700 font-medium">
                                        <p><span className="text-gray-500 w-20 inline-block font-semibold">Name:</span> {viewingOrder.shippingInfo?.fullName || "N/A"}</p>
                                        <p><span className="text-gray-500 w-20 inline-block font-semibold">Email:</span> {viewingOrder.userEmail}</p>
                                        <p><span className="text-gray-500 w-20 inline-block font-semibold">Phone:</span> {viewingOrder.shippingInfo?.phone || "N/A"}</p>
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 leading-relaxed">
                                            <span className="text-blue-600 text-[11px] uppercase font-bold tracking-wider mb-2 block">Shipping Address</span>
                                            {viewingOrder.shippingInfo?.address}<br/>
                                            {viewingOrder.shippingInfo?.city}, {viewingOrder.shippingInfo?.zipCode}<br/>
                                            {viewingOrder.shippingInfo?.country}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Order Items</h3>
                                    <div className="flex flex-col gap-4">
                                        {viewingOrder.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className="w-14 h-14 bg-white rounded-md border border-gray-100 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                                                    <img src={item.image} alt="" className="max-w-full max-h-full mix-blend-multiply" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.title}</span>
                                                    <span className="text-xs font-semibold text-gray-500 mt-1">Qty: {item.qty} <span className="mx-1">•</span> ${item.currentPrice?.toFixed(2)}</span>
                                                </div>
                                                <span className="font-extrabold text-gray-900 text-sm ml-2">${(item.qty * item.currentPrice).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                        <span className="text-gray-700 font-bold uppercase text-xs tracking-wider">Total Paid</span>
                                        <span className="text-2xl font-extrabold text-blue-600">${viewingOrder.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;