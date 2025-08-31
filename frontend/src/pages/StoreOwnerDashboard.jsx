import { useEffect, useState } from "react";
import client from "../api/client";
import { toast } from "react-toastify";

export default function StoreOwnerDashboard() {
    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);

    const [newPassword, setNewPassword] = useState("");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await client.get("/stores?owned=true");
                setStores(res.data);

                // fetch ratings for each store
                const ratingsData = {};
                for (let store of res.data) {
                    const r = await client.get(`/stores/${store.id}/ratings`);
                    ratingsData[store.id] = r.data.ratings || [];
                }
                setRatings(ratingsData);
            } catch {
                toast.error("Failed to fetch store/ratings");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

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

    if (loading) return <p className="p-8">Loading dashboard...</p>;
    if (!stores.length) return <p className="p-8">You don’t own any store yet.</p>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">
                Welcome, {userName}! – Store Owner Dashboard
            </h1>

            {stores.map((store) => {
                const storeRatings = ratings[store.id] || [];
                const avgRating =
                    storeRatings.length > 0
                        ? storeRatings.reduce((acc, r) => acc + r.rating, 0) /
                        storeRatings.length
                        : 0;

                return (
                    <div key={store.id} className="mb-8">
                        {/* Store Header */}
                        <div className="bg-white p-6 shadow rounded-lg mb-6">
                            <h2 className="text-xl font-semibold">{store.name}</h2>
                            <p className="text-gray-600">{store.address}</p>
                            <p className="text-yellow-600 font-bold">
                                Average Rating: {avgRating.toFixed(1)}
                            </p>
                        </div>

                        {/* Ratings Table */}
                        <div className="bg-white shadow rounded-lg p-6 mb-10">
                            <h3 className="text-lg font-bold mb-4">User Ratings</h3>
                            {storeRatings.length > 0 ? (
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border p-2">User</th>
                                            <th className="border p-2">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storeRatings.map((r, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="border p-2">
                                                    {r.user?.name || "Anonymous"}
                                                </td>
                                                <td className="border p-2">{r.rating}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">No ratings yet</p>
                            )}
                        </div>
                    </div>
                );
            })}

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
