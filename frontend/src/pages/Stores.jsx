import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function Stores() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStores() {
            try {
                const res = await client.get("/stores");
                setStores(res.data);
            } catch (err) {
                console.error("Failed to fetch stores", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStores();
    }, []);

    const filteredStores = stores.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <p className="p-8">Loading stores...</p>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
                Explore Our Stores 
            </h1>

            {/* Search */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search stores by name or address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-3 border rounded-lg w-full max-w-md"
                />
            </div>

            {/* Store Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                    <div
                        key={store.id}
                        className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition"
                    >
                        <h2 className="text-xl font-bold text-gray-800">{store.name}</h2>
                        <p className="text-gray-500">{store.address}</p>
                        <p className="mt-2 text-sm text-gray-600">
                             Overall Rating:{" "}
                            {store.avgRating ? store.avgRating.toFixed(1) : "N/A"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
