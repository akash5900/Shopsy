import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiRupee } from "react-icons/bi";

export default function Order() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getOrder() {
    try {
      const res = await fetch(`http://localhost:3000/api/order/userorder`, {
        credentials: "include",
      });

      const data = await res.json();

      setOrders(data.orders || null);
    } catch (error) {
      console.error("Get order error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrder();
  }, []);

  async function handleDelete(orderId, productId) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/order/${orderId}/product/${productId}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      await getOrder();
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelOrder(orderId, productId) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/order/${orderId}/cancel/${productId}`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      }

      alert(data.message);

      await getOrder();
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="mb-4 text-gray-500">
            You have not placed any orders yet.
          </p>

          <button
            onClick={() => navigate("/")}
            className="cursor-pointer font-medium text-blue-600 hover:underline"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-3 py-3 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-row justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

              <p className="mt-2 text-sm text-gray-500">
                {orders.length} order
                {orders.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-fit cursor-pointer font-medium text-blue-600"
            >
              Home
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Order ID</p>

                    <p className="mt-1 break-all font-medium text-gray-900">
                      {order._id}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${order.orderStatus === "Delivered"
                      ? "bg-green-50 text-green-700"
                      : order.orderStatus === "Cancelled"
                        ? "bg-red-50 text-red-700"
                        : order.orderStatus === "Shipped"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {order.products?.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 p-3 sm:gap-4 sm:p-6"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
                      {(
                        item.selectedImage ||
                        item.variant?.image ||
                        item.image ||
                        item.product?.image
                      ) ? (
                        <img
                          src={
                            item.selectedImage ||
                            item.variant?.image ||
                            item.product?.image
                          }
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-4">
                        <div className="min-w-0">
                          <h3 className="break-words font-medium text-gray-900">
                            {item.product?.name || "Product"}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center font-semibold text-gray-900">
                          <BiRupee />
                          {(Number(item.price) * Number(item.quantity)).toFixed(
                            2,
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500 sm:mt-4 sm:gap-4">
                          <span>Qty: {item.quantity}</span>

                          <span>·</span>

                          <span className="flex items-center">
                            <BiRupee />
                            {Number(item.price).toFixed(2)} each
                          </span>
                        </div>

                        {(item.orderStatus || order.orderStatus) ===
                          "Placed" && (
                            <button
                              onClick={() =>
                                cancelOrder(order._id, item.product._id)
                              }
                              className="mt-2 cursor-pointer rounded border border-red-200 px-2 py-1 text-sm text-red-500 sm:mt-4"
                            >
                              Cancel Order
                            </button>
                          )}

                        {(item.orderStatus || order.orderStatus) ===
                          "Cancelled" && (
                            <button
                              onClick={() =>
                                handleDelete(order._id, item.product._id)
                              }
                              className="mt-2 cursor-pointer rounded border border-red-200 px-2 py-1 text-sm text-red-500 sm:mt-4"
                            >
                              Delete Order
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
                <h2 className="font-semibold text-gray-900">
                  Shipping Address
                </h2>

                <div className="mt-3 break-words text-sm leading-6 text-gray-500">
                  <p className="font-medium text-gray-900">
                    {order.address?.username}
                  </p>

                  <p>{order.address?.houseaddress}</p>

                  <p>
                    {order.address?.city}, {order.address?.state} -{" "}
                    {order.address?.pincode}
                  </p>

                  <p>{order.address?.mobilenumber}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 sm:px-6 sm:py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>

                    <p className="mt-1 font-medium text-gray-900">
                      {order.paymentmethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>

                    <p
                      className={`mt-1 font-medium ${order.paymentstatus === "Paid"
                        ? "text-green-600"
                        : order.paymentstatus === "Cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                        }`}
                    >
                      {order.paymentstatus}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total</p>

                    <p className="mt-1 flex items-center text-xl font-bold text-gray-900">
                      <BiRupee />
                      {Number(order.totalamount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
