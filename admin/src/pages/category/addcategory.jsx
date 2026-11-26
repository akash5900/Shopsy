
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Addcategory() {
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState({
        name: "",
        image: "",
    });

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch("/api/category/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formdata),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert(data.message);
            navigate("/admin/allcategories");
        } catch (error) {
            console.log(error);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setFormdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <div className="flex items-center justify-center mt-8 sm:mt-[100px] px-3 sm:px-4">
            <div className="w-full max-w-[400px] flex flex-col gap-[20px] p-2 sm:p-5">
                <form
                    className="border border-blue-200 rounded-lg flex flex-col justify-center items-center gap-5 px-4 py-8 sm:py-10 bg-gray-50 hover:shadow-xl"
                    onSubmit={handleSubmit}
                >
                    <h1 className="text-xl font-semibold pb-3">Add Category</h1>

                    <input
                        type="text"
                        required
                        name="name"
                        value={formdata.name}
                        onChange={handleChange}
                        placeholder="Enter Name"
                        className="w-full bg-white border border-gray-400 rounded-lg p-2"
                    />

                    <input
                        type="text"
                        required
                        name="image"
                        value={formdata.image}
                        onChange={handleChange}
                        placeholder="Enter ImageURL"
                        className="w-full bg-white border border-gray-400 rounded-lg p-2"
                    />

                    <button
                        className="border border-gray-500 rounded-md bg-white p-2 cursor-pointer hover:bg-blue-100 w-full max-w-[200px]"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Addcategory;