import { useState, useEffect } from "react";

export default function Allorders() {
  const [allorders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getorders() {
    try {
      const res = await fetch("/api/order/allorders", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      setAllOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getorders();
  }, []);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/order/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      setAllOrders((orders) =>
        orders.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price || 0);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading orders...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <h1 className="mb-6 text-xl font-bold text-gray-800">All Orders</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left md:text-[15px]">
          <thead className="bg-blue-200">
            <tr>
              <th className="whitespace-nowrap px-5 py-4">User ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Product</th>
              <th className="p-2">Price</th>
              <th className="p-2">Payment Status</th>
              <th className="p-2">Payment Method</th>
              <th className="p-2">Order Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {allorders.map((order) => (
              <tr key={order._id} className="">
                <td className="whitespace-nowrap px-5 py-4">
                  {order.user?._id || "N/A"}
                </td>

                <td className="whitespace-nowrap px-5 py-4 font-medium ">
                  {order.user?.username || order.address?.username || "N/A"}
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-2">
                    {order.products?.map((item, index) => (
                      <div key={item.product?._id || index}>
                        <p className="font-medium text-gray-800">
                          {item.product?.name || "Product unavailable"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 font-semibold ">
                  {formatPrice(order.totalamount)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.paymentstatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentstatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentstatus || "Pending"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 ">
                  {order.paymentmethod || "N/A"}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={order.orderStatus || "Placed"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`rounded-md border-0 px-3 py-2 text-sm font-medium outline-none ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "Shipped"
                          ? "bg-purple-100 text-purple-700"
                          : order.orderStatus === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}

            {allorders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-10 text-center text-gray-500 bg-gray-50"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
