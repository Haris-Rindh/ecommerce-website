import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, updatePassword, updateEmail, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { db } from '../../firebase';
import { useGlobalContext } from '../../context/GlobalState';
import { useToast } from '../../context/ToastContext';
import { Package, User, LogOut, Settings, ChevronRight, Shield } from 'lucide-react';

const Profile = () => {
    const { user, logoutUser, isAuthLoading } = useGlobalContext();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [showSecurityAuth, setShowSecurityAuth] = useState(false);
    const navigate = useNavigate();
    const showToast = useToast();
    
    const [activeTab, setActiveTab] = useState('details'); 
    
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // 1. Fetch Orders (Existing logic)
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const q = query(collection(db, "orders"), where("userId", "==", user.uid));
                const snap = await getDocs(q);
                const ordersData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(ordersData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (activeTab === 'orders') fetchOrders();
    }, [user, activeTab]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user) {
                setEditName(user.displayName || '');
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setEditPhone(docSnap.data().phoneNumber || '');
                    }
                } catch (error) {
                    console.error("Error fetching details:", error);
                }
            }
        };
        fetchUserDetails();
    }, [user]);

    const handleUpdateDetails = async () => {
        if (!editName.trim()) return showToast("Name cannot be empty.", "error");
        
        setIsUpdating(true);
        try {
            await updateProfile(user, { displayName: editName });
            
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { 
                fullName: editName, 
                phoneNumber: editPhone 
            });
            
            showToast("Profile updated successfully!", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to update profile.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isAuthLoading || !user) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans">
            <div className="max-w-[1180px] mx-auto px-4">
                <div className='flex items-center gap-2 text-gray-500 text-sm mb-6'>
                    <Link to="/" className='hover:text-blue-600 transition-colors'>Home</Link>
                    <ChevronRight size={16} />
                    <span className='text-gray-900 font-medium'>My Profile</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
                    
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-fit overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-blue-50 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-semibold text-gray-900 truncate">{user.displayName || "User"}</span>
                                <span className="text-xs text-gray-500">Verified Buyer</span>
                            </div>
                        </div>
                        <div className="flex flex-col p-2">
                            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${activeTab === 'orders' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                                <Package size={20} /> My Orders
                            </button>
                            <button onClick={() => setActiveTab('details')} className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${activeTab === 'details' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                                <User size={20} /> Account Details
                            </button>
                            <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                                <Settings size={20} /> Settings
                            </button>
                            <hr className="my-2 border-gray-200" />
                            <button onClick={() => { logoutUser(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-md font-medium transition-colors">
                                <LogOut size={20} /> Log Out
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        
                        {activeTab === 'orders' && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                                {isLoading ? (
                                    <div className="w-full py-12 text-center text-gray-500 font-medium bg-white rounded-lg border border-gray-200">Loading your orders...</div>
                                ) : orders.length === 0 ? (
                                    <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 text-center">
                                        <Package size={48} className="text-gray-300 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                                        <Link to="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between">
                                                    <div className="flex gap-8 text-sm">
                                                        <div className="flex flex-col"><span className="text-gray-500">Order Placed</span><span className="font-medium text-gray-900">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span></div>
                                                        <div className="flex flex-col"><span className="text-gray-500">Total</span><span className="font-medium text-gray-900">${order.totalAmount?.toFixed(2)}</span></div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs text-gray-500">Order # {order.id.slice(0, 10)}</span>
                                                        <span className="text-sm font-bold text-green-600 mt-1">{order.status || 'Processing'}</span>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex flex-col gap-4">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center p-2"><img src={item.image} alt={item.title} className="max-w-full max-h-full mix-blend-multiply" /></div>
                                                            <div className="flex flex-col flex-1"><span className="font-medium text-blue-600">{item.title}</span><span className="text-sm text-gray-500">Qty: {item.qty}</span></div>
                                                            <span className="font-bold text-gray-900">${item.currentPrice?.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'details' && (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
                                <div className="flex flex-col gap-5 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={editName} 
                                            onChange={(e) => setEditName(e.target.value)} 
                                            className="w-full p-2.5 bg-white border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={editPhone} 
                                            onChange={(e) => setEditPhone(e.target.value)} 
                                            className="w-full p-2.5 bg-white border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-gray-400 text-xs font-normal">(Cannot be changed)</span></label>
                                        <input 
                                            type="email" 
                                            disabled 
                                            value={user.email} 
                                            className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded text-gray-500 cursor-not-allowed" 
                                        />
                                    </div>
                                    <button 
                                        onClick={handleUpdateDetails} 
                                        disabled={isUpdating}
                                        className="mt-4 w-full sm:w-fit bg-[#0D6EFD] text-white px-8 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                                    >
                                        {isUpdating ? "Saving..." : "Update Info"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                
                                <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm mb-8 flex items-start gap-3">
                                    <Shield className="shrink-0 mt-0.5 text-yellow-600" size={18} />
                                    <p>Security operations require you to enter your current password to verify your identity. If you signed in with Google, you must re-authenticate via Google to make account changes.</p>
                                </div>

                                <div className="flex flex-col gap-8">
                                    
                                    <div className="border-b border-gray-100 pb-8">
                                        <h3 className="font-bold text-gray-900 mb-4">Change Email Address</h3>
                                        <div className="flex flex-col gap-3 max-w-sm">
                                            <input type="email" placeholder="New Email Address" value={newEmail} onChange={e=>setNewEmail(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-blue-500" />
                                            <input type="password" placeholder="Current Password (Required)" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-blue-500" />
                                            <button onClick={async () => {
                                                if(!currentPassword) return showToast("Current password required", "error");
                                                try {
                                                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                                                    await reauthenticateWithCredential(user, credential);
                                                    await updateEmail(user, newEmail);
                                                    showToast("Email updated successfully!", "success");
                                                } catch(err) { showToast(err.message, "error"); }
                                            }} className="bg-blue-50 text-blue-700 font-medium py-2.5 rounded hover:bg-blue-100 transition-colors">Update Email</button>
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-100 pb-8">
                                        <h3 className="font-bold text-gray-900 mb-4">Change Password</h3>
                                        <div className="flex flex-col gap-3 max-w-sm">
                                            <input type="password" placeholder="Current Password (Required)" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-blue-500" />
                                            <input type="password" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-blue-500" />
                                            <button onClick={async () => {
                                                if(!currentPassword || newPassword.length < 6) return showToast("Valid current and new password required (min 6 chars)", "error");
                                                try {
                                                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                                                    await reauthenticateWithCredential(user, credential);
                                                    await updatePassword(user, newPassword);
                                                    showToast("Password updated successfully!", "success");
                                                    setNewPassword(''); setCurrentPassword('');
                                                } catch(err) { showToast(err.message, "error"); }
                                            }} className="bg-blue-50 text-blue-700 font-medium py-2.5 rounded hover:bg-blue-100 transition-colors">Update Password</button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-red-600 mb-2">Delete Account</h3>
                                        <p className="text-sm text-gray-500 mb-4">Permanently remove your data, order history, and saved items from our servers. This action cannot be undone.</p>
                                        <div className="flex flex-col gap-3 max-w-sm">
                                            <input type="password" placeholder="Current Password to confirm deletion" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full p-2.5 border border-red-300 rounded outline-none focus:border-red-500 bg-red-50" />
                                            <button onClick={async () => {
                                                if(!window.confirm("Are you absolutely sure? This cannot be undone.")) return;
                                                if(!currentPassword) return showToast("Current password required to delete account.", "error");
                                                try {
                                                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                                                    await reauthenticateWithCredential(user, credential);
                                                    await deleteUser(user);
                                                    showToast("Account deleted.", "info");
                                                    navigate('/');
                                                } catch(err) { showToast(err.message, "error"); }
                                            }} className="bg-red-600 text-white font-medium px-4 py-2.5 rounded hover:bg-red-700 transition-colors shadow-sm">Permanently Delete Account</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;