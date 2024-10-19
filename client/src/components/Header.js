import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="backdrop-blur-lg shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        ForestIQ
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            to="/signup"
                            className="text-gray-300 hover:text-white transition duration-300"
                        >
                            Signup
                        </Link>
                        <Link
                            to="/login"
                            className="text-gray-300 hover:text-white transition duration-300"
                        >
                            Login
                        </Link>
                    </nav>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-gray-300 focus:outline-none focus:text-white transition duration-300">
                            {/* Menu icon */}
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
