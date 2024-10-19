import React from "react";
import { Leaf, TreePine, Map, BarChart, Droplet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Card = ({ children, className = "", ...props }) => (
    <div
        className={`bg-gray-900/50 backdrop-blur-sm text-white rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl ${className}`}
        {...props}
    >
        {children}
    </div>
);

const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const menuItems = [
        {
            title: "Green Cover Estimator",
            description: "Analyze and estimate green coverage in your area",
            path: "/greencover",
            icon: <Leaf className="w-6 h-6" />,
            color: "bg-emerald-500"
        },
        {
            title: "Trees Count",
            description: "Track and monitor tree population",
            path: "/treecount",
            icon: <TreePine className="w-6 h-6" />,
            color: "bg-green-600"
        },
        {
            title: "Tree Species",
            description: "Identify and catalog different tree species",
            path: "/treespecies",
            icon: <TreePine className="w-6 h-6" />,
            color: "bg-lime-500"
        },
        {
            title: "Optimal Pathing",
            description: "Find the most efficient routes for tree mapping",
            path: "/optimalpathing",
            icon: <Map className="w-6 h-6" />,
            color: "bg-cyan-500"
        },
        {
            title: "Historical Data",
            description: "View past records and analyze trends",
            path: "/historicaldata",
            icon: <BarChart className="w-6 h-6" />,
            color: "bg-blue-500"
        },
        {
            title: "Soil pH",
            description: "Measure and monitor soil acidity and alkalinity levels for healthier trees.",
            path: "/soilph",
            icon: <Droplet className="w-6 h-6" />,
            color: "bg-teal-500"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <div className="max-w-7xl mx-auto p-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-6">
                        Tree Mapping Dashboard
                    </h1>
                    <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                        Discover comprehensive tools for urban forest management, tree tracking, and green cover analysis. Our platform provides powerful insights and data visualization to help maintain urban greenery efficiently.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {menuItems.map((item, index) => (
                        <Card
                            key={index}
                            className="p-8 cursor-pointer group"
                            onClick={() => handleNavigation(item.path)}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`${item.color} p-3 rounded-lg text-white group-hover:rotate-12 transition-transform duration-500`}>
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-3">
                                        {item.title}
                                    </h2>
                                    <p className="text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <h2 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        Why Urban Tree Mapping Matters
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Tree mapping provides valuable insights for urban planning, environmental sustainability, and biodiversity conservation. By monitoring tree population, species diversity, and green cover, cities can create healthier, greener spaces for their citizens.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
