import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'firebase/auth';
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
    
    const [usePhoneAuth, setUsePhoneAuth] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

    const navigate = useNavigate();

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
            });
        }
    };

    const handlePhoneAuth = async (e) => {
        e.preventDefault();
        if (!phoneNumber) return setError("Please enter your phone number.");
        setError('');
        setIsProcessing(true);
        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(confirmation);
            setOtpSent(true);
            setIsProcessing(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setIsProcessing(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return setError("Please enter the OTP.");
        setError('');
        setIsProcessing(true);
        try {
            await confirmationResult.confirm(otp);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError("Invalid OTP. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

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

                <div id="recaptcha-container"></div>
                {usePhoneAuth ? (
                    <form onSubmit={otpSent ? handleVerifyOtp : handlePhoneAuth} className="flex flex-col gap-5">
                        {!otpSent ? (
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone Number</label>
                                <input type="tel" required placeholder="+1 555 123 4567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Enter OTP</label>
                                <input type="text" required placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                            </div>
                        )}
                        <button type="submit" disabled={isProcessing} className="w-full bg-[#0D6EFD] text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 transition-colors mt-2 text-[16px] disabled:bg-blue-300 shadow-sm">
                            {isProcessing ? "Processing..." : (otpSent ? 'Verify OTP' : 'Send OTP')}
                        </button>
                        <button type="button" onClick={() => { setUsePhoneAuth(false); setOtpSent(false); setError(''); }} className="text-sm text-blue-600 font-semibold hover:underline mt-2 text-center">
                            Back to Email Login
                        </button>
                    </form>
                ) : (
                    <>
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

                        <div className="relative flex items-center justify-center text-sm mt-6 mb-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <span className="relative bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button type="button" onClick={handleGoogleLogin} className="w-full border border-gray-300 bg-white text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                                Google
                            </button>
                            <button type="button" onClick={() => { setUsePhoneAuth(true); setError(''); }} className="w-full border border-gray-300 bg-white text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                Phone Number
                            </button>
                        </div>

                        <div className="mt-8 text-center text-[15px] text-gray-700">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); setConfirmPassword(''); }} className="text-blue-600 font-semibold hover:underline">
                                {isLogin ? 'Register now' : 'Sign in instead'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;