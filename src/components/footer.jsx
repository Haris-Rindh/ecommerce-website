import React, { useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, ChevronUp, ShoppingBag } from 'lucide-react';
import { AppStore, PlayStore, US, Germany, France } from '../assets/images/index';

const footerLinks = [
    {
        title: "About",
        links: [
            { label: "About Us", href: "https://www.google.com" },
            { label: "Find store", href: "https://www.google.com" },
            { label: "Categories", href: "https://www.google.com" },
            { label: "Blogs", href: "https://www.google.com" }
        ]
    },
    {
        title: "Partnership",
        links: [
            { label: "About Us", href: "https://www.google.com" },
            { label: "Find store", href: "https://www.google.com" },
            { label: "Categories", href: "https://www.google.com" },
            { label: "Blogs", href: "https://www.google.com" }
        ]
    },
    {
        title: "Information",
        links: [
            { label: "Help Center", href: "https://www.google.com" },
            { label: "Money Refund", href: "https://www.google.com" },
            { label: "Shipping", href: "https://www.google.com" },
            { label: "Contact us", href: "https://www.google.com" }
        ]
    },
    {
        title: "For users",
        links: [
            { label: "Login", href: "https://www.google.com" },
            { label: "Register", href: "https://www.google.com" },
            { label: "Settings", href: "https://www.google.com" },
            { label: "My Orders", href: "https://www.google.com" }
        ]
    }
];

const socialLinks = [
    { Icon: Facebook, href: "https://facebook.com", hoverClass: "hover:bg-gradient-to-r from-sky-500 to-blue-600" },
    { Icon: Twitter, href: "https://twitter.com", hoverClass: "hover:bg-[#1DA1F2]" },
    { Icon: Linkedin, href: "https://linkedin.com", hoverClass: "hover:bg-[#0A66C2]" },
    { Icon: Instagram, href: "https://instagram.com", hoverClass: "hover:bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" },
    { Icon: Youtube, href: "https://youtube.com", hoverClass: "hover:bg-[#FF1111]" }
];

const Footer = () => {
    const [isLangOpen, setIsLangOpen] = useState(false);

    const [selectedLang, setSelectedLang] = useState({ name: "English", flag: US });

    const languages = [
        { name: "English", flag: US },
        { name: "German", flag: Germany },
        { name: "French", flag: France }
    ];

    return (
        <footer className="w-full bg-white font-sans">
            <div className='mx-auto max-w-[1180px] pt-10 pb-12 flex justify-between'>
                
                <div className="max-w-[276px]">
                    <div className='flex items-center gap-2 mb-4'>
                        <div className="bg-blue-500 p-2 rounded-md text-white">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="font-bold text-2xl text-blue-500 tracking-wide">
                            Brand
                        </span>
                    </div>
                    
                    <p 
                        className="text-gray-500 text-[16px] leading-relaxed mb-5"
                    >
                        Best information about the company goes here but now lorem ipsum is
                    </p>
                    
                    <div className="flex gap-3">
                        {socialLinks.map((social, idx) => (
                            <a  
                                key={idx}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center transition-colors duration-300 ${social.hoverClass}`}
                            >
                                <social.Icon size={18}/>
                            </a>
                        ))}
                    </div>
                </div>

                {footerLinks.map((column, index) => (
                    <div key={index}>
                        <h4 
                            className="font-semibold text-gray-900 mb-4"
                        >
                            {column.title}
                        </h4>
                        <ul 
                            className="flex flex-col gap-2"
                        >
                            {column.links.map((link, linkIndex) => (
                                <li 
                                    key={linkIndex}>
                                    <a 
                                        href={link.href}
                                        target='_blank'
                                        className="text-gray-500 hover:text-gray-900 text-[15px] transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div>
                    <h4 
                        className="font-semibold text-gray-900 mb-4"
                    >
                        Get app
                    </h4>
                    <div 
                        className="flex flex-col gap-2"
                    >
                        <a 
                            
                            href="#" 
                            className="hover:opacity-80 transition-opacity"
                        >
                            <img src={AppStore} alt="Download on the App Store" className="h-[40px] w-auto bg-black rounded-md" 
                        />
                        </a>
                        <a 
                            href="#" 
                            className="hover:opacity-80 transition-opacity"
                        >
                            <img src={PlayStore} alt="Get it on Google Play" className="h-[40px] w-auto bg-black rounded-md" 
                        />
                        </a>
                    </div>
                </div>
                
            </div>

            <div
                className="w-full bg-gray-100 border-t border-gray-200"
            >
                <div 
                    className="mx-auto max-w-[1180px] py-4 flex justify-between items-center"
                >
                    <span 
                        className="text-gray-500 text-[15px]"
                    >
                        &copy; 2026 Haris Rindh.
                    </span>
                
                    <div className="relative">
                        <button 
                            onClick={() => setIsLangOpen(!isLangOpen)} 
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <img 
                                src={selectedLang.flag} 
                                alt={`${selectedLang.name} Flag`} 
                                className="w-6 h-auto" 
                            />
                            <span
                                className="text-[15px] font-medium">
                                {selectedLang.name}
                            </span>
                            
                            <ChevronUp size={18} 
                                className={`transform transition-transform ${isLangOpen ? 'rotate-180' : ''}`} 
                            />
                        </button>

                        {isLangOpen && (
                            <div 
                                className="absolute bottom-full right-0 mb-3 w-36 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden flex flex-col z-10"
                            >
                                {languages.map((lang, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedLang(lang);
                                            setIsLangOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                                    >
                                        <img src={lang.flag} alt="" className="w-5 h-auto" />
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;