import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaTrashAlt, FaArrowRight } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import useWishlist from "../context/useWishlist";
import useAuth from "../context/useAuth";

export default function Wishlist() {
    const navigate = useNavigate();
    const { wishlist, loading, removeFromWishlist } = useWishlist();
    const { user } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">Loading wishlist...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-3 py-4 sm:px-4 md:px-4 2xl:px-6">
                <div className="mb-8">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <FaHeart className="text-red-500" />
                                <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                                    My Wishlist
                                </h1>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved for later
                            </p>
                        </div>

                        <button
                            type="button"
                            className="cursor-pointer text-sm font-semibold hover:text-blue-500 sm:text-base"
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>

                {!user ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center sm:p-14">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                            <FaHeart className="text-2xl text-red-400" />
                        </div>
                        <h2 className="mt-5 text-xl font-semibold text-gray-900">
                            Login to view your wishlist
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Sign in to save your favourite products and access them anytime.
                        </p>
                        <Link
                            to="/login"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Login
                        </Link>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center sm:p-14">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                            <FaHeart className="text-2xl text-red-400" />
                        </div>
                        <h2 className="mt-5 text-xl font-semibold text-gray-900">
                            Your wishlist is empty
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Save the products you love and keep them all in one place.
                        </p>
                        <Link
                            to="/products"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Explore Products <FaArrowRight size={12} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                        {wishlist.map((product) => (
                            <article
                                key={product._id}
                                className="relative flex min-w-0 flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2 transition hover:bg-gray-50 hover:shadow-lg sm:p-4"
                            >
                                <button
                                    type="button"
                                    aria-label="Remove from wishlist"
                                    onClick={() => removeFromWishlist(product._id)}
                                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:bg-red-50"
                                >
                                    <FaTrashAlt size={13} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate(`/productdetail/${product._id}`);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="flex w-full cursor-pointer justify-center"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-[120px] w-full rounded-lg object-contain sm:h-[160px] 2xl:h-[190px]"
                                    />
                                </button>

                                <div className="flex min-w-0 flex-1 flex-col gap-2 text-gray-700">
                                    <div className="flex min-w-0 items-start justify-between gap-1">
                                        <h2 className="line-clamp-2 min-w-0 text-xs font-semibold sm:text-sm">
                                            {product.name}
                                        </h2>
                                        <div className="flex shrink-0 items-center text-sm font-semibold text-gray-900">
                                            <BiRupee />
                                            {product.price}
                                        </div>
                                    </div>

                                    <p className="line-clamp-2 text-[10px] text-gray-500 sm:text-xs">
                                        {product.description}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate(`/productdetail/${product._id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                        className="mt-auto w-full rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 sm:text-sm"
                                    >
                                        View Product
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
