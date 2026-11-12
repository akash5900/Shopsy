import { useContext } from "react";
import WishlistContext from "./wishlistContext";

export default function useWishlist() {
    return useContext(WishlistContext);
}
