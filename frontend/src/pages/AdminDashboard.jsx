import { useEffect, useState } from "react";
import client from "../api/client";

export default function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Add User form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });

  // Add Store form state
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "", // added ownerId
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const u = await client.get("/users");
        setUsers(u.data);

        const s = await client.get("/stores");
        setStores(s.data);

        const r = await client.get("/ratings/count");
        setTotalRatings(r.data.count);
      } catch (err) {
        console.error("Admin dashboard fetch failed", err);
        if (err.response) {
          console.error("Error status:", err.response.status);
          console.error("Error data:", err.response.data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ------------------ ADD USER ------------------
  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (newUser.name.length < 20 || newUser.name.length > 60)
      return setFormError("Name must be 20–60 characters");
    if (!/\S+@\S+\.\S+/.test(newUser.email))
      return setFormError("Invalid email format");
    if (!newUser.address || newUser.address.length > 400)
      return setFormError("Address required, max 400 chars");
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(newUser.password))
      return setFormError(
        "Password must be 8–16 chars, 1 uppercase & 1 special"
      );

    try {
      await client.post("/users", newUser);
      setFormSuccess(" User added successfully!");
      setUsers([...users, { ...newUser, id: Date.now() }]); // update UI
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER",
      });
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add user");
    }
  };

  // ------------------ ADD STORE ------------------
  const handleAddStore = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Trim values
    const name = newStore.name.trim();
    const email = newStore.email?.trim() || "";
    const address = newStore.address.trim();
    const ownerId = newStore.ownerId ? Number(newStore.ownerId) : null;

    // Validation
    if (name.length < 3)
      return setFormError("Store name must be at least 3 characters");
    if (!address || address.length > 400)
      return setFormError("Address required, max 400 characters");
    if (email && !/\S+@\S+\.\S+/.test(email))
      return setFormError("Invalid store email format");

    try {
      // API call
      const res = await client.post("/stores", {
        name,
        email: email || null,
        address,
        owner: ownerId ? { id: ownerId } : null,
      });

      // Success handling
      setFormSuccess("Store added successfully!");
      setStores((prev) => [...prev, res.data]); // use backend response (with real id)
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
    } catch (err) {
      console.error("Add store error:", err.response?.data || err);
      setFormError(err.response?.data?.message || "Failed to add store");
    }
  };


  if (loading) return <p className="p-8">Loading dashboard...</p>;

  // ------------------ FILTERS ------------------
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.address?.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Stores</h2>
          <p className="text-2xl font-bold">{stores.length}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Ratings</h2>
          <p className="text-2xl font-bold">{totalRatings}</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Name, Email, Address, Role"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-2 w-full border rounded"
      />

      {/* Add User Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        {formError && <div className="text-red-600 mb-2">{formError}</div>}
        {formSuccess && <div className="text-green-600 mb-2">{formSuccess}</div>}

        <form onSubmit={handleAddUser} className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            className="p-2 border rounded w-full"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded w-full"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <textarea
            placeholder="Address"
            className="p-2 border rounded w-full"
            value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded w-full"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <select
            className="p-2 border rounded w-full"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="USER">Normal User</option>
            <option value="OWNER">Store Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Add Store Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Add New Store</h2>

        <form onSubmit={handleAddStore} className="space-y-3">
          <input
            type="text"
            placeholder="Store name"
            className="p-2 border rounded w-full"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Store email (optional)"
            className="p-2 border rounded w-full"
            value={newStore.email}
            onChange={(e) =>
              setNewStore({ ...newStore, email: e.target.value })
            }
          />
          <textarea
            placeholder="Store address"
            className="p-2 border rounded w-full"
            value={newStore.address}
            onChange={(e) =>
              setNewStore({ ...newStore, address: e.target.value })
            }
            required
          />

          {/* Owner selection */}
          <select
            className="p-2 border rounded w-full"
            value={newStore.ownerId}
            onChange={(e) =>
              setNewStore({ ...newStore, ownerId: e.target.value })
            }
          >
            <option value="">-- Select Store Owner (optional) --</option>
            {users
              .filter((u) => u.role === "OWNER")
              .map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Store
          </button>
        </form>
      </div>

      {/* Stores Table */}
      <div className="bg-white shadow rounded-lg p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Stores</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border p-2">{store.name}</td>
                <td className="border p-2">{store.email || "—"}</td>
                <td className="border p-2">{store.address}</td>
                <td className="border p-2">
                  {store.owner ? store.owner.name : "—"}
                </td>
                <td className="border p-2">
                  {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.address || "—"}</td>
                <td className="border p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
