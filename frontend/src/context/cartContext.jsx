import { createContext, useState, useEffect, Children } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  async function handleRemove(id) {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      alert(data.message);

      getCart();
    } catch (error) {
      console.log(error);
    }
  }

  async function getCart() {
    try {
      const res = await fetch("/api/cart/usercart", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      setCart(data.cart || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCart();
  }, []);

  const getItemPrice = (item) =>
    Number(
      item.variant?.price ??
        item.product?.variant?.price ??
        item.price ??
        item.product?.price ??
        0,
    );

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity ?? 1),
    0,
  );

  const subtotal = cart.reduce((total, item) => {
    return total + getItemPrice(item) * Number(item.quantity ?? 1);
  }, 0);

  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        getCart,
        loading,
        total,
        totalItems,
        handleRemove,
        getItemPrice,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
