// src/components/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; 
import { auth, db } from '../../firebase'; 
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); 
    
    const [fullName, setFullName] = useState(''); 
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    
    const [showPassword, setShowPassword] = useState(false); 
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsProcessing(false);
            return;
        }

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await updateProfile(user, { displayName: fullName });

                const userDocRef = doc(db, "users", user.uid); 
                await setDoc(userDocRef, {
                    fullName: fullName,
                    email: email,
                    phoneNumber: phoneNumber,
                    createdAt: serverTimestamp(),
                    isVerified: false 
                });

                console.log("Registered with complete details!");
                navigate('/');
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.message.replace('Firebase: Error ', '').replace(' (auth/email-already-in-use).', ' This email is already registered.'));
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-8 md:py-12 px-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-10">
                <h2 className="text-3xl font-extrabold text-gray-950 text-center mb-8 tracking-tight">
                    {isLogin ? 'Sign in to Account' : 'Create an Account'}
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-6 border border-red-200 font-medium">
                        🚨 {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Complete Details: Full Name</label>
                            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email Address</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Complete Details: Phone Number</label>
                            <input type="tel" required placeholder="+1 (555) 123-4567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password {!isLogin && "(min 6 characters)"}</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required minLength="6"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Confirm Password</label>
                            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                        </div>
                    )}

                    <button type="submit" disabled={isProcessing} className="w-full bg-[#0D6EFD] text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 transition-colors mt-2 text-[16px] disabled:bg-blue-300 shadow-sm shadow-blue-200">
                        {isProcessing ? (isLogin ? "Signing in..." : "Registering...") : (isLogin ? 'Sign In' : 'Register with Details')}
                    </button>
                </form>

                <div className="mt-8 text-center text-[15px] text-gray-700">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); setConfirmPassword(''); }} className="text-blue-600 font-semibold hover:underline">
                        {isLogin ? 'Register now' : 'Sign in instead'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;