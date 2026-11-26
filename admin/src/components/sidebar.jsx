
import { BiSolidDownArrow } from "react-icons/bi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa6";
import { TbCategoryPlus } from "react-icons/tb";
import { TiShoppingCart } from "react-icons/ti";
import { IoPersonCircle } from "react-icons/io5";

export default function Sidebar() {
    const navigate = useNavigate();

    const [openproduct, setOpenproduct] = useState(false);
    const [opencategory, setOpencategory] = useState(false);

    async function handleLogout() {
        try {
            const res = await fetch("/api/user/adminlogout", {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert(data.message);
            navigate("/admin/login", { replace: true });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="p-3 sm:p-4 md:p-3">
            <h1 className="text-xl font-semibold mb-4 text-gray-900">
                Admin Panel
            </h1>

            <ul className="space-y-2 ml-1 sm:ml-2">
                <li>
                    <Link
                        to={"/admin/dashboard"}
                        className="flex items-center gap-2 cursor-pointer text-gray-700"
                    >
                        <RiDashboardFill size={22} />
                        <h1 className="text-md font-semibold">Dashboard</h1>
                    </Link>
                </li>

                <li>
                    <div
                        onClick={() => setOpenproduct(!openproduct)}
                        className="flex items-center gap-2 cursor-pointer text-gray-700"
                    >
                        <FaBoxOpen size={22} />
                        <h1 className="text-md font-semibold">Products</h1>
                        <BiSolidDownArrow size={14} />
                    </div>

                    {openproduct && (
                        <ul className="ml-8 mt-2 space-y-2 text-gray-700">
                            <li>
                                <Link
                                    to={"/admin/addproduct"}
                                    className="cursor-pointer font-semibold"
                                >
                                    Add Product
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to={"/admin/allproducts"}
                                    className="cursor-pointer font-semibold"
                                >
                                    All products
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>

                <li>
                    <div
                        onClick={() => setOpencategory(!opencategory)}
                        className="flex items-center gap-2 cursor-pointer text-gray-700"
                    >
                        <TbCategoryPlus size={22} />
                        <h1 className="text-md font-semibold">Category</h1>
                        <BiSolidDownArrow size={14} />
                    </div>

                    {opencategory && (
                        <ul className="ml-8 mt-2 space-y-2 text-gray-700">
                            <li>
                                <Link
                                    to={"/admin/addcategory"}
                                    className="cursor-pointer font-semibold"
                                >
                                    Add Category
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to={"/admin/allcategories"}
                                    className="cursor-pointer font-semibold"
                                >
                                    All Categories
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>

                <li>
                    <Link
                        to={"/admin/allorders"}
                        className="flex items-center gap-2 cursor-pointer text-gray-700"
                    >
                        <TiShoppingCart size={22} />
                        <h1 className="text-md font-semibold">Orders</h1>
                    </Link>
                </li>

                <li>
                    <Link
                        to={"/admin/allusers"}
                        className="flex items-center gap-2 cursor-pointer text-gray-700"
                    >
                        <IoPersonCircle size={22} />
                        <h1 className="text-md font-semibold">Users</h1>
                    </Link>
                </li>

                <li>
                    <button
                        onClick={handleLogout}
                        className="border px-3 py-1.5 mt-2 rounded hover:bg-gray-200 cursor-pointer text-gray-900 text-base sm:text-lg font-semibold"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}
