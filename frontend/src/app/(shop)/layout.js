"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ShopLayout({ children }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}
