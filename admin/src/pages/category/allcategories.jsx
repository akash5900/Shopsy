
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Allcategories() {
    const [category, setCategory] = useState([]);

    async function getCategory() {
        try {
            const res = await fetch("/api/category/allcategory");
            const data = await res.json();
            setCategory(data.categorys);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    async function handleDelete(id) {
        try {
            const res = await fetch(`/api/category/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            alert("Category Deleted");
            getCategory();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="space-y-4 text-gray-900">
            <div className="flex flex-wrap justify-between items-center gap-3 text-lg sm:text-xl font-semibold">
                <h1>All Categories</h1>

                <Link
                    to={"/admin/addcategory"}
                    className="cursor-pointer text-blue-600 hover:text-blue-800 text-base sm:text-lg"
                >
                    +Add Category
                </Link>
            </div>

            <div className="w-full overflow-x-auto rounded-lg shadow-sm">
                <table className="w-full min-w-[550px] border border-gray-200 border-collapse table-fixed">
                    <thead className="bg-blue-200">
                        <tr className="text-base sm:text-lg">
                            <th className="p-2 text-center">Image</th>
                            <th className="p-2 text-center">Name</th>
                            <th className="p-2 text-center">Edit</th>
                            <th className="p-2 text-center">Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {category.map((cat) => (
                            <tr
                                key={cat._id}
                                className="font-semibold border-b border-gray-200"
                            >
                                <td className="p-2">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-20 h-16 sm:w-25 sm:h-18 object-cover rounded my-2 mx-auto md:ml-20 2xl:ml-35"
                                    />
                                </td>

                                <td className="p-3 text-center">
                                    {cat.name}
                                </td>

                                <td className="p-3 align-middle text-center">
                                    <Link
                                        to={`/admin/updatecategory/${cat._id}`}
                                        className="border border-gray-800 px-2 rounded hover:bg-blue-300 cursor-pointer"
                                    >
                                        Edit
                                    </Link>
                                </td>

                                <td className="p-3 align-middle text-center">
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="border border-gray-800 px-2 rounded hover:bg-red-500 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}