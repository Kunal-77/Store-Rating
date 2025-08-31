import { useEffect, useState } from "react";
import client from "../api/client";
import { toast } from "react-toastify";

export default function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    // change password states
    const [newPassword, setNewPassword] = useState("");
    const userId = Number(localStorage.getItem("userId")); //  stored at login
    const userName = localStorage.getItem("userName");

    // Fetch stores (token is auto-attached by client.js)
    useEffect(() => {
        async function fetchStores() {
            try {
                const res = await client.get("/stores");
                setStores(res.data);
            } catch (err) {
                console.error("Fetch stores error:", err.response?.data || err);
                toast.error("Failed to fetch stores");
            } finally {
                setLoading(false);
            }
        }
        fetchStores();
    }, []);

    //  Submit rating
    const handleRating = async (id, rating) => {
        console.log("Star clicked:", { id, rating });
        try {
            //  no userId here, backend uses JWT
            const requestData = { storeId: id, rating };
            await client.post("/ratings", requestData);

            // update state immediately
            setStores((prev) =>
                prev.map((s) =>
                    s.id === id ? { ...s, myRating: rating } : s
                )
            );

            toast.success("Rating submitted!");
        } catch (err) {
            console.error("Rating error:", err.response?.data || err);
            toast.error("Failed to submit rating");
        }
    };

    //  Sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        setStores((prev) =>
            [...prev].sort((a, b) =>
                sortOrder === "asc"
                    ? (a[field] || "").toString().localeCompare((b[field] || "").toString())
                    : (b[field] || "").toString().localeCompare((a[field] || "").toString())
            )
        );
    };

    //  Change password
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await client.put(`/users/${userId}/password`, { password: newPassword });
            toast.success("Password updated successfully!");
            setNewPassword("");
        } catch {
            toast.error("Failed to update password");
        }
    };

    if (loading) return <p className="p-8">Loading stores...</p>;

    const filteredStores = stores.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">
                Welcome, {userName || "User"}! – Available Stores
            </h1>

            {/* Search + Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search stores by Name or Address"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 flex-1 border rounded"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSort("name")}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Sort by Name
                    </button>
                    <button
                        onClick={() => handleSort("address")}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Sort by Address
                    </button>
                </div>
            </div>

            {/* Store List */}
            <div className="space-y-4 mb-10">
                {filteredStores.map((store) => (
                    <div
                        key={store.id}
                        className="bg-white shadow rounded-lg p-6 flex justify-between items-center"
                    >
                        <div>
                            <h2 className="text-lg font-bold">{store.name}</h2>
                            <p className="text-gray-600">{store.address}</p>
                            <p className="text-sm text-gray-500">
                                Overall Rating:{" "}
                                {store.averageRating !== null
                                    ? store.averageRating.toFixed(1)
                                    : "N/A"}
                            </p>
                            <p className="text-sm text-green-600">
                                Your Rating: {store.myRating ?? "Not rated yet"}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(store.id, star)}
                                    className={`px-3 py-1 rounded ${Number(store.myRating) === star
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    {star}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Change Password Section */}
            <div className="bg-white shadow rounded-lg p-6 max-w-md">
                <h2 className="text-lg font-bold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-3">
                    <input
                        type="password"
                        placeholder="New Password"
                        className="p-2 border rounded w-full"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}
