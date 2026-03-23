import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronDown } from 'lucide-react';

const Navbar = () => {
    
   const handleLanguageChange = (option) => {
        const languageMap = {
            "English": "en",
            "Spanish": "es",
            "French": "fr"
        };
        
        const langCode = languageMap[option];
        
        const googleSelect = document.querySelector('select.goog-te-combo');
        
        if (googleSelect) {
            googleSelect.value = langCode;
            googleSelect.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            document.cookie = `googtrans=/en/${langCode}; path=/`;
            document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/`;
            window.location.reload();
        }
    };
    return (
        <nav className='w-full bg-white border-b border-gray-200'>
            <div id="google_translate_element" style={{ display: 'none' }}></div>
            
            <div className="mx-auto w-full max-w-[1180px] md:h-[56px] flex flex-col md:flex-row justify-between items-center px-4 py-2 md:py-3">
                <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <ul className="flex items-center text-sm md:text-base whitespace-nowrap gap-2 md:gap-0">
                        <li className="md:mr-4">
                            <Link to="/category/all" className="flex items-center gap-1.5 font-medium text-blue-600 bg-blue-50 md:bg-transparent md:text-gray-700 hover:text-blue-500 px-3 py-1.5 md:px-0 md:py-0 rounded-md md:rounded-none transition-colors">
                                <Menu size={18} className="hidden md:block" />
                                <span>All category</span>
                            </Link>
                        </li>
                        <li className="md:mr-4"><Link to="/search?q=hot+offers" className="block text-gray-600 bg-gray-100 md:bg-transparent md:text-gray-700 hover:text-blue-500 px-3 py-1.5 md:px-0 md:py-0 rounded-md md:rounded-none font-medium transition-colors">Hot offers🔥</Link></li>
                        <li className="md:mr-4"><Link to="/search?q=gift+boxes" className="block text-gray-600 bg-gray-100 md:bg-transparent md:text-gray-700 hover:text-blue-500 px-3 py-1.5 md:px-0 md:py-0 rounded-md md:rounded-none font-medium transition-colors">Gift boxes</Link></li>
                        <li className="md:mr-4"><Link to="/search?q=projects" className="block text-gray-600 bg-gray-100 md:bg-transparent md:text-gray-700 hover:text-blue-500 px-3 py-1.5 md:px-0 md:py-0 rounded-md md:rounded-none font-medium transition-colors">Projects</Link></li>
                        <li className="md:mr-4"><Link to="/search?q=menu+items" className="block text-gray-600 bg-gray-100 md:bg-transparent md:text-gray-700 hover:text-blue-500 px-3 py-1.5 md:px-0 md:py-0 rounded-md md:rounded-none font-medium transition-colors">Menu items</Link></li>
                        <li className="hidden md:block">
                            <NavDropDown 
                                label="Help"
                                options={["Contact Us", "Chat Support", "FAQ"]}
                                isLink={true} 
                            />
                        </li>
                    </ul>
                </div>

                <div className="hidden md:flex gap-6 mt-3 md:mt-0">
                    <NavDropDown 
                        label="English"
                        options={["English", "Spanish", "French"]}
                        onSelect={handleLanguageChange}
                    />
                    <NavDropDown 
                        label="Ship to USA"
                        options={["Ship to USD", "Ship to EUR", "Ship to GBP"]}
                    />
                </div>
            </div>
        </nav>
    )
}

function NavDropDown({label, options, isLink = false, onSelect}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState(label);
    const dropDownRef = React.useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

   const handleOptionClick = (option, e) => {
        e.preventDefault();
        setIsOpen(false);
        
        if (isLink) {
            if (option === "Contact Us") navigate("/contact");
            else if (option === "FAQ") navigate("/faq");
            else navigate("/support"); 
        } else {
            setSelectedOption(option);
            if (onSelect) {
                onSelect(option);
            }
        }
    };

    return (
        <div className="relative" ref={dropDownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center gap-1 cursor-pointer transition-colors duration-200 hover:text-blue-500"
            >
                <span>{selectedOption}</span>
                <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 min-w-[120px] bg-white border border-gray-200 rounded shadow-lg z-50 text-sm overflow-hidden">
                    {options.map((option, index) => (
                        <button 
                            key={index}
                            onClick={(e) => handleOptionClick(option, e)}
                            className={`w-full text-left block px-4 py-2 cursor-pointer transition-colors ${
                                selectedOption === option && !isLink
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-500'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
export default Navbar;