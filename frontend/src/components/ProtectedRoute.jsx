import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const user = jwtDecode(token);

        // If roles are specified, check if user has permission
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                    <div className="glass-card p-8 max-w-md text-center">
                        <div className="text-6xl mb-4"></div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Access Denied
                        </h1>
                        <p className="text-slate-600 mb-6">
                            You don't have permission to access this page.
                        </p>
                        <a
                            href="/dashboard"
                            className="btn-primary inline-block"
                        >
                            Go to Dashboard
                        </a>
                    </div>
                </div>
            );
        }

        // User is authenticated and authorized
        return children;
    } catch (error) {
        // Invalid token
        localStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }
}
