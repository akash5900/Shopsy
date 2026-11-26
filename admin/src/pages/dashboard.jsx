
import { useState, useEffect } from "react";
import { HiUsers } from "react-icons/hi2";
import { BsBoxFill } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { MdLocalShipping } from "react-icons/md";
import { useNavigate } from "react-router";
import { PiUserCircleBold } from "react-icons/pi";
import useAuth from "../context/useAuth";

export default function Dashboard() {
    const navigate = useNavigate();
    const [allusers, setAllUsers] = useState(null);
    const [allproducts, setAllProducts] = useState();
    const [allorders, setAllOrders] = useState();
    const [allcategory, setAllCategory] = useState();
    const { users } = useAuth();

    async function getAllUsers() {
        try {
            const res = await fetch("/api/user/allusers");
            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
                return;
            }

            setAllUsers(data.users);
        } catch (error) {
        }
    }

    async function getProducts() {
        try {
            const res = await fetch(
                "/api/products/allproducts",
            );

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
            }

            setAllProducts(data.products);
        } catch (error) {
            console.log(error);
        }
    }

    async function getorders() {
        try {
            const res = await fetch(
                "/api/order/allorders",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
                return;
            }

            setAllOrders(data.orders);
        } catch (error) {
            console.log(error);
        }
    }

    async function getAllCategory() {
        try {
            const res = await fetch(
                "/api/category/allcategory",
            );

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
            }

            setAllCategory(data.categorys);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllUsers();
        getProducts();
        getAllCategory();
        getorders();
    }, []);

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const getOrderStatusColor = (status) => {
        switch (status) {
            case "Placed":
                return "bg-yellow-100 text-yellow-700";
            case "Shipped":
                return "bg-blue-100 text-blue-700";
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500">
                        Welcome back! Here is your store overview.
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <PiUserCircleBold size={30} />
                    <h1 className="font-semibold text-sm sm:text-base text-slate-700">
                        {users[0]?.username || "Admin"}
                    </h1>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div
                    onClick={() => navigate("/admin/allusers")}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm cursor-pointer"
                >
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                        <HiUsers size={26} />
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Total Users</p>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-800">
                            {allusers?.length ?? 0}
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Registered users
                        </p>
                    </div>
                </div>

                <div
                    onClick={() => navigate("/admin/allproducts")}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm cursor-pointer"
                >
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                        <BsBoxFill />
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Total Products</p>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-800">
                            {allproducts?.length ?? 0}
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Products in store
                        </p>
                    </div>
                </div>

                <div
                    onClick={() => navigate("/admin/allcategories")}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm cursor-pointer"
                >
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                        <BiSolidCategory size={28} />
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Categories</p>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-800">
                            {allcategory?.length ?? 0}
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Product categories
                        </p>
                    </div>
                </div>

                <div
                    onClick={() => navigate("/admin/allorders")}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm cursor-pointer"
                >
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                        <MdLocalShipping size={28} />
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Total Orders</p>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-800">
                            {allorders?.length ?? 0}
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Customer orders
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">

                <div className="rounded-xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm xl:col-span-2 md:p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                Recent Products
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Your latest store products
                            </p>
                        </div>

                        <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                            {allproducts?.length ?? 0} Products
                        </span>
                    </div>

                    {allproducts?.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {allproducts.slice(-5).reverse().map((product, index) => (
                                <div
                                    key={product._id || index}
                                    className="flex items-center gap-3 py-4"
                                >
                                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl">loading...</span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold text-slate-800">
                                            {product.name || "Unnamed Product"}
                                        </h3>
                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            {product.description || "No description"}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-xs sm:text-sm font-bold text-slate-800">
                                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-sm text-slate-500">
                            No products available.
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm md:p-6">
                    <h2 className="text-lg font-bold text-slate-800">
                        Store Overview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Current records in your store
                    </p>

                    <div className="mt-5 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 shrink-0 rounded-full bg-blue-500" />
                                <span className="text-sm text-slate-600">
                                    Registered Users
                                </span>
                            </div>
                            <span className="font-bold text-slate-800">
                                {allusers?.length ?? 0}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-500" />
                                <span className="text-sm text-slate-600">
                                    Products
                                </span>
                            </div>
                            <span className="font-bold text-slate-800">
                                {allproducts?.length ?? 0}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 shrink-0 rounded-full bg-purple-500" />
                                <span className="text-sm text-slate-600">
                                    Categories
                                </span>
                            </div>
                            <span className="font-bold text-slate-800">
                                {allcategory?.length ?? 0}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 shrink-0 rounded-full bg-orange-500" />
                                <span className="text-sm text-slate-600">
                                    Orders
                                </span>
                            </div>
                            <span className="font-bold text-slate-800">
                                {allorders?.length ?? 0}
                            </span>
                        </div>
                    </div>

                    <div className="mt-7 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                        Store overview
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 md:p-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Recent Orders
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Latest orders from your customers
                        </p>
                    </div>

                    <span className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700">
                        {allorders?.length ?? 0} Orders
                    </span>
                </div>

                {allorders?.length > 0 ? (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[750px] text-left">
                            <thead className="bg-slate-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-4 sm:px-6 py-4 font-semibold">
                                        Order ID
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 font-semibold">
                                        Customer
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 font-semibold">
                                        Amount
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 font-semibold">
                                        Payment Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 font-semibold">
                                        Order Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {allorders.slice(-5).reverse().map((order) => (
                                    <tr
                                        key={order._id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-700">
                                            #{order._id}
                                        </td>

                                        <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">
                                            {order.user?.username ||
                                                order.address?.username ||
                                                "Customer"}
                                        </td>

                                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-800">
                                            ₹{Number(order.totalamount ?? 0).toLocaleString("en-IN")}
                                        </td>

                                        {/* Payment Status */}
                                        <td className="px-4 sm:px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusColor(order.paymentstatus)
                                                    }`}
                                            >
                                                {order.paymentstatus || "Pending"}
                                            </span>
                                        </td>

                                        {/* Order Status */}
                                        <td className="px-4 sm:px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getOrderStatusColor(order.orderStatus)
                                                    }`}
                                            >
                                                {order.orderStatus || "Placed"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-sm text-slate-500">
                        No orders available yet.
                    </div>
                )}
            </div>
        </div>
    );
}
