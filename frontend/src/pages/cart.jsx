import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import useCart from "../context/useCart";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, loading, total, handleRemove, getItemPrice, subtotal } =
    useCart();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 py-4 sm:px-4 md:px-4 2xl:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Shopping Cart
            </h1>
            <button
              className="cursor-pointer text-base sm:text-lg font-semibold hover:text-blue-500"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products to your cart and they will appear here.
            </p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:gap-15 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 sm:gap-5 border-b border-gray-100 p-3 sm:p-5 last:border-b-0"
                  >
                    <div className="h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={item.variant?.image || item.product?.image}
                        alt={item.product?.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2 sm:gap-4">
                        <div className="min-w-0">
                          <h2 className="break-words text-sm sm:text-base font-semibold text-gray-900">
                            {item.product?.name}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            ₹{getItemPrice(item).toFixed(2)}
                          </p>

                          {item.variant && (
                            <div className="mt-1 text-sm text-gray-500">
                              {item.variant.size && (
                                <p>Size: {item.variant.size}</p>
                              )}
                              {item.variant.color && (
                                <p>Color: {item.variant.color}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item from cart"
                          onClick={() => handleRemove(item._id)}
                          className="mt-1 shrink-0 cursor-pointer text-red-500"
                        >
                          <ImCross size={15} />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4 sm:pt-5">
                        <div className="flex items-center rounded-lg border border-gray-200 p-2">
                          <p className="text-xs sm:text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          ₹
                          {(
                            getItemPrice(item) * Number(item.quantity ?? 1)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/"
                className="mt-5 inline-block text-sm font-medium text-gray-600 hover:text-black"
              >
                ← Continue Shopping
              </Link>
            </div>

            <div className="min-w-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Subtotal</span>

                    <span className="font-medium text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Shipping</span>

                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout", { state: { cart } })}
                  type="button"
                  className="mt-6 w-full rounded-xl bg-black px-4 sm:px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Proceed to Checkout
                </button>

                <p className="mt-4 text-center text-xs text-gray-400">
                  Secure checkout · Free returns
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}