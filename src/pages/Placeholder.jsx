import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const Placeholder = () => {
    const location = useLocation();
    const pageName = location.pathname.replace('/', '').charAt(0).toUpperCase() + location.pathname.slice(2);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 font-sans px-4">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Wrench size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{pageName} Page</h1>
            <p className="text-gray-500 max-w-md text-center mb-8 text-lg">
                We are currently building this feature. Check back soon for updates!
            </p>
            <Link to="/" className="px-6 py-3 bg-[#0D6EFD] text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Return to Home
            </Link>
        </div>
    );
};

export default Placeholder;