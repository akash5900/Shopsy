import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [users, setUsers] = useState([]);

    async function getUsers() {
        try {
            const res = await fetch("/api/user/allusers");

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
            }

            setUsers(data.users);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    async function deleteUser(id) {
        try {
            const res = await fetch(`/api/user/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
            }

            alert(data.message);

            getUsers();
        } catch (error) {
            console.log(error);
        }
    }

    return <AuthContext value={{ getUsers, deleteUser, users }}>
        {children}
    </AuthContext>
}

export default AuthContext;