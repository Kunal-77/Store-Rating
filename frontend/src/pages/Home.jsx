import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name") || "User";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg text-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">
                    Welcome, {name}! 
                </h1>
                <p className="text-gray-600 mb-6">
                    This is your personalized dashboard. Choose where you want to go next:
                </p>

                <div className="space-y-3">
                    {role === "ADMIN" && (
                        <Link
                            to="/admin"
                            className="block bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow"
                        >
                            Go to Admin Dashboard
                        </Link>
                    )}
                    {role === "OWNER" && (
                        <Link
                            to="/owner"
                            className="block bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow"
                        >
                            Go to Store Owner Dashboard
                        </Link>
                    )}
                    {role === "USER" && (
                        <Link
                            to="/user"
                            className="block bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold shadow"
                        >
                            Go to User Dashboard
                        </Link>
                    )}
                    <Link
                        to="/stores"
                        className="block bg-gray-800 hover:bg-black text-white py-3 rounded-lg font-semibold shadow"
                    >
                        Browse Stores
                    </Link>
                </div>
            </div>
        </div>
    );
}
