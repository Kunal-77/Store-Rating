import { useState } from "react";
import { signup as signupApi } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (form.name.length < 20 || form.name.length > 60)
      return "Name must be 20–60 characters";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format";
    if (!form.address || form.address.length > 400)
      return "Address is required and must be under 400 characters";
    const passRe = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRe.test(form.password))
      return "Password must be 8–16 chars with 1 uppercase & 1 special";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      toast.error(v);
      return;
    }

    setLoading(true);
    try {
      await signupApi(form);
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) {
        msg.forEach((m) => toast.error(m)); // show all backend validation errors
      } else {
        toast.error(msg || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold mb-4">Create account</h1>

        <input
          type="text"
          className="mb-3 p-2 border rounded w-full"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          className="mb-3 p-2 border rounded w-full"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          className="mb-3 p-2 border rounded w-full"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <input
          type="password"
          className="mb-3 p-2 border rounded w-full"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <select
          className="mb-4 p-2 border rounded w-full"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="USER">Normal User</option>
          <option value="OWNER">Store Owner</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Already have account link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login as Existing User
          </Link>
        </p>
      </form>
    </div>
  );
}
