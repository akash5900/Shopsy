import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiRupee } from "react-icons/bi";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    username: "",
    mobilenumber: "",
    houseaddress: "",
    city: "",
    pincode: "",
    state: "",
  });

  const checkoutState = location.state;

  const checkoutProduct = Array.isArray(checkoutState?.cart)
    ? checkoutState.cart
    : checkoutState?.product
      ? [
        {
          product: checkoutState.product,
          quantity: checkoutState.quantity,
          price: checkoutState.price,
          variant: checkoutState.variant,
          selectedImage: checkoutState.selectedImage,
        },
      ]
      : [];

  const totalamount = checkoutProduct.reduce((total, item) => {
    return (
      total +
      Number(item.variant?.price ?? item.price ?? item.product?.price ?? 0) *
      Number(item.quantity ?? 1)
    );
  }, 0);

  async function saveAddress() {
    if (
      !addressForm.username ||
      !addressForm.mobilenumber ||
      !addressForm.houseaddress ||
      !addressForm.city ||
      !addressForm.pincode ||
      !addressForm.state
    ) {
      alert("Please fill all address fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/address/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save address");
        return;
      }

      setAddresses((prev) => [...prev, data.Address]);
      setSelectedAddress(data.Address);
      setShowAddressForm(false);

      setAddressForm({
        username: "",
        mobilenumber: "",
        houseaddress: "",
        city: "",
        pincode: "",
        state: "",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAddress(id) {
    try {
      const res = await fetch(`http://localhost:3000/api/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete address");
        return;
      }

      setAddresses((prev) => prev.filter((address) => address._id !== id));

      if (selectedAddress?._id === id) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAddresses() {
    try {
      const res = await fetch(
        "http://localhost:3000/api/address/useraddresses",
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      setAddresses(data.Addresses || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAddresses();
  }, []);

  async function placeOrderCOD() {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }


    if (checkoutProduct.length === 0) {
      alert("No product selected for checkout");
      return;
    }

    try {
      const products = checkoutProduct.map((item) => ({
        product: item.product._id,
        quantity: Number(item.quantity),
        price: Number(
          item.variant?.price ?? item.price ?? item.product?.price ?? 0,
        ),
        variant: item.variant?._id ?? null,
        selectedImage: item.selectedImage || item.variant?.image || item.image || item.product?.image || "",
      }));

      const res = await fetch("http://localhost:3000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          products,
          totalamount,
          address: {
            username: selectedAddress.username,
            mobilenumber: selectedAddress.mobilenumber,
            houseaddress: selectedAddress.houseaddress,
            city: selectedAddress.city,
            pincode: selectedAddress.pincode,
            state: selectedAddress.state,
          },
          paymentmethod: "COD",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to place order");
        return;
      }

      alert(data.message || "Order placed successfully");

      navigate("/orders");
    } catch (error) {
      console.log(error);
      alert("Something went wrong while placing order");
    }
  }

  async function placeOrderRazorpay() {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    if (checkoutProduct.length === 0) {
      alert("No product selected for checkout");
      return;
    }

    setPaymentLoading(true);
    try {
      const products = checkoutProduct.map((item) => ({
        product: item.product._id,
        quantity: Number(item.quantity ?? 1),
        variant: item.variant?._id ?? null,
        selectedImage: item.selectedImage || item.variant?.image || item.image || item.product?.image || "",
      }));
      const address = {
        username: selectedAddress.username,
        mobilenumber: selectedAddress.mobilenumber,
        houseaddress: selectedAddress.houseaddress,
        city: selectedAddress.city,
        pincode: selectedAddress.pincode,
        state: selectedAddress.state,
      };

      const scriptLoaded = await new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      if (!scriptLoaded) throw new Error("Unable to load Razorpay Checkout. Please check your internet connection.");

      const orderRes = await fetch("http://localhost:3000/api/order/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ products, address }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Unable to start payment");

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Shopsy",
        description: "Order Payment",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: selectedAddress.username,
          contact: String(selectedAddress.mobilenumber),
        },
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("http://localhost:3000/api/order/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                ...response,
                products,
                address,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              alert(verifyData.message || "Payment verification failed. Please contact support with your payment ID.");
              return;
            }
            alert(verifyData.message || "Payment successful");
            navigate("/orders");
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment was completed, but order confirmation failed. Please contact support with your payment ID.");
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        alert(response.error?.description || "Payment failed. Please try again.");
        setPaymentLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert(error.message || "Something went wrong while starting payment");
      setPaymentLoading(false);
    }
  }

  if (checkoutProduct.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            No product selected for checkout.
          </p>

          <button
            onClick={() => navigate("/")}
            className="text-blue-600 font-medium hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-3 md:py-6 md:px-4 lg:px-6">
      <h1 className="md:text-xl 2xl:text-2xl font-bold text-gray-900 mb-3 md:mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-5">Products</h2>

            <div className="space-y-6">
              {checkoutProduct.map((item) => {
                const price = Number(
                  item.variant?.price ?? item.price ?? item.product?.price ?? 0,
                );

                const quantity = Number(item.quantity ?? 1);

                return (
                  <div
                    key={item._id || item.product?._id}
                    className="flex gap-5 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="w-32 h-32 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      <img
                        src={
                          item.selectedImage ||
                          item.variant?.image ||
                          item.image ||
                          item.product?.image
                        }
                        alt={item.product?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product?.name}
                      </h3>

                      {item.variant && (
                        <div className="mt-2 text-sm text-gray-600">
                          {item.variant.size && (
                            <p>
                              Size:{" "}
                              <span className="font-medium">
                                {item.variant.size}
                              </span>
                            </p>
                          )}

                          {item.variant.color && (
                            <p>
                              Color:{" "}
                              <span className="font-medium">
                                {item.variant.color}
                              </span>
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center mt-3">
                        <BiRupee />

                        <span className="text-lg font-bold sm:text-xl">
                          {price.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        Quantity: {quantity}
                      </p>

                      <p className="text-sm text-gray-700 mt-2">
                        Item Total: ₹{(price * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Delivery Address</h2>

              <button
                onClick={() => setShowAddressForm((prev) => !prev)}
                className="cursor-pointer text-blue-600 font-medium"
              >
                + Add Address
              </button>
            </div>

            {showAddressForm && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-5">Add New Address</h3>

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>

                    <input
                      type="text"
                      value={addressForm.username}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          username: e.target.value,
                        })
                      }
                      placeholder="Enter name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mobile Number
                    </label>

                    <input
                      type="tel"
                      value={addressForm.mobilenumber}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          mobilenumber: e.target.value,
                        })
                      }
                      placeholder="Enter mobile number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      House Address
                    </label>

                    <input
                      type="text"
                      value={addressForm.houseaddress}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          houseaddress: e.target.value,
                        })
                      }
                      placeholder="Enter house number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          city: e.target.value,
                        })
                      }
                      placeholder="Enter city"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      value={addressForm.pincode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          pincode: e.target.value,
                        })
                      }
                      placeholder="Enter pincode"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          state: e.target.value,
                        })
                      }
                      placeholder="Enter state"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={saveAddress}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg mb-2"
                >
                  Save Address
                </button>
              </div>
            )}

            {loading ? (
              <p className="text-gray-500">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="text-gray-500">
                No address found. Please add an address.
              </p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    onClick={() => setSelectedAddress(address)}
                    className={`border rounded-xl p-4 cursor-pointer transition ${selectedAddress?._id === address._id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedAddress?._id === address._id}
                        onChange={() => setSelectedAddress(address)}
                      />

                      <div className="flex w-full min-w-0 items-start justify-between gap-3 sm:gap-6">
                        <div>
                          <p className="font-semibold">{address.username}</p>

                          <p className="text-sm text-gray-600">
                            {address.mobilenumber}
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            {address.houseaddress}, {address.city},{" "}
                            {address.state} - {address.pincode}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(address._id);
                          }}
                          className="cursor-pointer hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="space-y-3">
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === "COD" ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}>
                <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
                <span>
                  <span className="block font-semibold">Cash on Delivery</span>
                  <span className="text-sm text-gray-500">Pay when your order is delivered.</span>
                </span>
              </label>

              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === "Razorpay" ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}>
                <input type="radio" name="paymentMethod" value="Razorpay" checked={paymentMethod === "Razorpay"} onChange={() => setPaymentMethod("Razorpay")} />
                <span>
                  <span className="block font-semibold">Pay Online (Razorpay Test Mode)</span>
                  <span className="text-sm text-gray-500">Pay securely using UPI, cards or net banking test credentials.</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="sticky top-6 rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4">
              {checkoutProduct.map((item) => {
                const price = Number(
                  item.variant?.price ?? item.price ?? item.product?.price ?? 0,
                );

                const quantity = Number(item.quantity ?? 1);

                return (
                  <div
                    key={item._id || item.product?._id}
                    className="flex justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity: {quantity}
                      </p>

                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          Size: {item.variant.size} | Color:{" "}
                          {item.variant.color}
                        </p>
                      )}
                    </div>

                    <span className="font-medium whitespace-nowrap">
                      ₹{(price * quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 my-5" />

            <div className="flex justify-between">
              <span className="text-lg font-semibold">Total</span>

              <div className="flex items-center">
                <BiRupee />

                <span className="text-xl font-bold">
                  {totalamount.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              disabled={!selectedAddress || paymentLoading}
              onClick={paymentMethod === "COD" ? placeOrderCOD : placeOrderRazorpay}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-3 transition"
            >
              {paymentLoading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : `Pay ₹${totalamount.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
