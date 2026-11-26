import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    mobilenumber: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/signup", {
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
      navigate("/login");
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
    <div className="min-h-screen flex justify-center pt-10 sm:pt-[100px] px-3 sm:px-4">
      <div className="w-full max-w-[400px] flex flex-col gap-[20px] p-2 sm:p-5">
        <form
          onSubmit={handleSubmit}
          className="border border-blue-200 rounded-lg flex flex-col justify-center items-center gap-5 px-4 sm:px-4 pt-8 sm:pt-10 pb-5 bg-gray-50 hover:shadow-xl"
        >
          <h1 className="text-xl font-semibold pb-3">Create Account</h1>

          <input
            type="text"
            name="username"
            value={formdata.username}
            onChange={handleChange}
            required
            placeholder="Enter name"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <input
            type="email"
            name="email"
            value={formdata.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <input
            type="tel"
            name="mobilenumber"
            value={formdata.mobilenumber}
            onChange={handleChange}
            required
            placeholder="Enter mobile number"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formdata.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full bg-white border border-gray-400 rounded-lg p-2 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="border border-gray-500 rounded-md bg-white p-2 cursor-pointer hover:bg-blue-100 w-full max-w-[200px]"
          >
            Sign Up
          </button>

          <div className="flex flex-wrap justify-center gap-1 text-sm sm:text-base">
            <h1>Have Account?</h1>
            <Link to={"/login"} className="cursor-pointer text-red-500">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
