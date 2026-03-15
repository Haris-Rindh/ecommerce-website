import React, { useEffect } from "react";
import { Menu, ChevronDown } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className='w-full bg-white border-b border-gray-200'>
            <div className="container mx-auto w-[1440px] h-[56px] flex justify-between items-center px-6 py-3">
                <ul className="flex items-center font-semibold">
                    <li className="mr-4"><a href="#" className="flex  gap-2 font-medium text-gray-700 hover:text-blue-500"><Menu />All categories</a></li>
                    <li className="mr-4"><a href="#" className="text-gray-700 hover:text-blue-500">Hot offers🔥</a></li>
                    <li className="mr-4"><a href="#" className="text-gray-700 hover:text-blue-500">Gift boxes</a></li>
                    <li className="mr-4"><a href="#" className="text-gray-700 hover:text-blue-500">Projects</a></li>
                    <li className="mr-4"><a href="#" className="text-gray-700 hover:text-blue-500">Menu items</a></li>
                    <li className="">
                        <NavDropDown 
                        label="Help"
                        options={["Contact Us", "Chat Support", "FAQ"]}
                        />
                    </li>
                </ul>
                <div className="flex gap-6">
                    <NavDropDown 
                    label="English"
                    options={["English", "Spanish", "French"]}
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

function NavDropDown({label, options}) {
    const[isOpen, setIsOpen] = React.useState(false);

    const [selectedOption, setSelectedOption] = React.useState(label);

    const dropDownRef = React.useRef(null);

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
                <div className="absolute top-full left-0 mt-2 w-30 bg-white border border-gray-200 rounded shadow-lg z-10 text-sm overflow-hidden">
                    {options.map((option, index) => (
                        <a 
                            key={index}
                            href={`#${option.toLowerCase().replace(/\s+/g, '-')}`} 
                            onClick={(e) => {
                                e.preventDefault();
                                
                                setSelectedOption(option); 
                                setIsOpen(false); 
                            }}
                            className={`block px-4 py-2 cursor-pointer transition-colors ${
                                selectedOption === option 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-500'
                            }`}
                        >
                            {option}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
export default Navbar
