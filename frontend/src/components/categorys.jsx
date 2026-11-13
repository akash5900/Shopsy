import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Category() {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  async function getCategory() {
    try {
      const res = await fetch("http://localhost:3000/api/category/allcategory");

      const data = await res.json();

      setCategory(data.categorys);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="p-2 md:px-4 md:py-3 xl:px-8 xl:py-2.5 2xl::px-8 2xl:py-4 border-t border-gray-200 ">
      <div className="flex overflow-x-auto scrollbar-none">
        {category.map((cat) => (
          <div
            className="flex items-center cursor-pointer text-gray-600 hover:text-black"
            key={cat._id}
          >
            <div
              onClick={() => {
                navigate(`/categoryproducts/${cat._id}`);
              }}
              className="flex flex-col items-center "
            >
              <h1 className="text-xs md:text-base font-semibold mr-8 md:mr-15 ">{cat.name}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
