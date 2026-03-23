
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ visible: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000); 
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            
            {toast.visible && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-3 transition-all duration-300 font-sans text-sm font-medium
                    ${toast.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                      toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                      'bg-gray-800 text-white border border-gray-700'}`}
                >
                    {toast.type === 'error' && <AlertCircle size={18} />}
                    {toast.type === 'success' && <CheckCircle size={18} />}
                    {toast.type === 'info' && <Info size={18} />}
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
};