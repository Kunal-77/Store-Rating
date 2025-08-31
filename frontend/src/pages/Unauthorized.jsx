export default function Unauthorized() {
    const role = localStorage.getItem("role");

    // Decide where to go if user is logged in
    let backPath = "/login";
    if (role === "ADMIN") backPath = "/admin";
    else if (role === "OWNER") backPath = "/owner";
    else if (role === "USER") backPath = "/user";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded p-8 text-center max-w-md">
                <h1 className="text-3xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
                <p className="text-gray-700 mb-6">
                    You don’t have permission to access this page.
                </p>

                {/* Go back to proper place */}
                <a
                    href={backPath}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-3"
                >
                    {role ? "Back to Dashboard" : "Go to Login"}
                </a>
            </div>
        </div>
    );
}
