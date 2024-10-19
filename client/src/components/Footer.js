import React from 'react';

const Footer = () => {
    return (
        <footer className="backdrop-blur-lg text-gray-300 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Copyright */}
                    <div className="text-sm">
                        &copy; {new Date().getFullYear()} ForestIQ. All Rights Reserved.
                    </div>

                    {/* Footer Links */}
                    <div className="space-x-6">
                        <a
                            href="/about"
                            className="text-gray-400 hover:text-white transition duration-300"
                        >
                            About Us
                        </a>
                        <a
                            href="/contact"
                            className="text-gray-400 hover:text-white transition duration-300"
                        >
                            Contact
                        </a>
                        <a
                            href="/privacy"
                            className="text-gray-400 hover:text-white transition duration-300"
                        >
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
