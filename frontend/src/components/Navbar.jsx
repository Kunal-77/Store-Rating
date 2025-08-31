import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav
            style={{
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#0366d6",
                color: "white",
            }}
        >
            {/* Left side - Logo */}
            <div
                style={{
                    fontWeight: 700,
                    fontSize: "18px",
                }}
            >
                Store Ratings
            </div>

            {/* Middle - Links */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {user && (
                    <>
                        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                            Home
                        </Link>
                        <Link to="/stores" style={{ color: "white", textDecoration: "none" }}>
                            Stores
                        </Link>
                    </>
                )}

                {user?.role === "ADMIN" && (
                    <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
                        Admin
                    </Link>
                )}
                {user?.role === "OWNER" && (
                    <Link to="/owner" style={{ color: "white", textDecoration: "none" }}>
                        Owner
                    </Link>
                )}
                {user?.role === "USER" && (
                    <Link to="/user" style={{ color: "white", textDecoration: "none" }}>
                        Dashboard
                    </Link>
                )}
            </div>

            {/* Right side - Auth Buttons */}
            <div>
                {!user ? (
                    <>
                        <Link to="/login" style={{ color: "white", marginRight: "12px", textDecoration: "none" }}>
                            Login
                        </Link>
                        <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>
                            Register
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={onLogout}
                        style={{
                            background: "transparent",
                            border: "1px solid white",
                            color: "white",
                            padding: "6px 14px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontWeight: 500,
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = "#e53e3e";
                            e.target.style.border = "1px solid #e53e3e";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = "transparent";
                            e.target.style.border = "1px solid white";
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
