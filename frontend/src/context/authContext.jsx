import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function logout() {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
      }

    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  async function fetchUser() {
    try {
      const res = await fetch("/api/user/profile", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();

      setUser(data.user);
    } catch (error) {
      console.error("Faild To Fetch User", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
