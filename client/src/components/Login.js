import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogIn, ArrowRight, Loader } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("https://forestiqfinal-backend.onrender.com/api/auth/login", formData);
            setMessage(res.data.message);

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                setTimeout(() => navigate("/"), 1500);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex justify-center items-center">
            <div className="max-w-md w-full p-6 bg-gray-900/70 rounded-xl shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
                        Login
                    </h2>
                    <LogIn className="h-10 w-10 text-green-400" />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="group flex items-center justify-center w-full py-4 px-6 
                     bg-green-500 hover:bg-green-600 rounded-xl font-medium
                     transition-all duration-200 disabled:opacity-50
                     disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin h-5 w-5 mr-2" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                Login
                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {message && (
                        <p className={`mt-4 text-center ${message.toLowerCase().includes('success') ? 'text-green-400' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
