import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const localCart = localStorage.getItem('ecommerce_cart');
            return localCart ? JSON.parse(localCart) : [];
        } catch (error) {
            console.error("Failed to load cart from storage", error);
            return [];
        }
    });

    const [saved, setSaved] = useState(() => {
        try {
            const localSaved = localStorage.getItem('ecommerce_saved');
            return localSaved ? JSON.parse(localSaved) : [];
        } catch (error) {
            console.error("Failed to load saved items from storage", error);
            return [];
        }
    });

    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logoutUser = () => {
        signOut(auth).then(() => {
            console.log("User logged out!");
        });
    };

    useEffect(() => {
        localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('ecommerce_saved', JSON.stringify(saved));
    }, [saved]);

    const getPrice = (product) => product.discountedPrice || product.price;

    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
            }
            return [...prev, { ...product, qty, currentPrice: getPrice(product) }];
        });
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
    
    const clearCart = () => setCart([]);
    
    const updateQty = (id, qty) => setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Number(qty) } : item));

    const toggleSaved = (product) => {
        setSaved(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) return prev.filter(item => item.id !== product.id);
            return [...prev, { ...product, currentPrice: getPrice(product) }];
        });
    };

    const moveToCart = (product) => {
        addToCart(product);
        setSaved(prev => prev.filter(item => item.id !== product.id));
    };

    return (
        <GlobalContext.Provider value={{ 
            cart, saved, addToCart, removeFromCart, clearCart, updateQty, toggleSaved, moveToCart, 
            user, logoutUser, isAuthLoading // <-- ADDED THESE
        }}>
            {!isAuthLoading && children} 
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);