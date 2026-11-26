import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminProtectedRoute({ children }) {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        async function checkAdmin() {
            try {
                const res = await fetch("/api/user/admin/me", {
                    credentials: "include",
                });


                if (res.ok) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error(error);
                setIsAdmin(false);
            }
        }

        checkAdmin();
    }, []);

    if (isAdmin === null) {
        return <p>Checking authentication...</p>;
    }

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
