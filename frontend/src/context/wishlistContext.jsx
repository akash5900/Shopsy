import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "./useAuth";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const getWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/wishlist", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status !== 401) console.error(data.message);
        setWishlist([]);
        return;
      }

      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) getWishlist();
  }, [authLoading, getWishlist]);

  async function addToWishlist(productId) {
    if (!user) {
      alert("Please login to use your wishlist");
      return false;
    }

    try {
      const res = await fetch("http://localhost:3000/api/wishlist/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Could not add product to wishlist");
        return false;
      }

      setWishlist(data.wishlist || []);
      return true;
    } catch (error) {
      console.error("addToWishlist error:", error);
      alert("Something went wrong. Please try again.");
      return false;
    }
  }

  async function removeFromWishlist(productId) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/wishlist/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Could not remove product");
        return false;
      }

      setWishlist(data.wishlist || []);
      return true;
    } catch (error) {
      console.error("removeFromWishlist error:", error);
      return false;
    }
  }

  async function toggleWishlist(productId) {
    const exists = wishlist.some((product) => String(product._id) === String(productId));
    return exists
      ? removeFromWishlist(productId)
      : addToWishlist(productId);
  }

  const wishlistIds = useMemo(
    () => new Set(wishlist.map((product) => String(product._id))),
    [wishlist],
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        wishlistCount: wishlist.length,
        loading: loading || authLoading,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted: (productId) => wishlistIds.has(String(productId)),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistContext;
