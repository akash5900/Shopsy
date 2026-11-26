import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/useAuth";

const Login = () => {
  const navigate = useNavigate();

  const { fetchUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");

  async function userLogin(e) {
    e.preventDefault();

    try {
      const isEmail = emailOrMobile.includes("@");

      const body = isEmail
        ? { email: emailOrMobile, password }
        : { mobilenumber: emailOrMobile, password };

      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      await fetchUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-center mt-6 md:mt-[50px] 2xl:mt-[100px] px-3 sm:px-4">
      <div className="w-full max-w-[400px] flex flex-col gap-[20px] p-2 sm:p-5">
        <form
          onSubmit={userLogin}
          className="border border-blue-200 rounded-lg flex flex-col justify-center items-center gap-5 px-4 pt-8 sm:pt-10 pb-5 bg-gray-50 hover:shadow-xl"
        >
          <h1 className="text-xl font-semibold pb-3">Login</h1>

          <input
            type="text"
            name="emailOrMobile"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            required
            placeholder="Enter email or mobile number"
            className="w-full bg-white border border-gray-400 rounded-lg p-2"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
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
            Login
          </button>

          <div className="flex flex-wrap justify-center gap-1 text-sm sm:text-base">
            <h1>New User?</h1>
            <Link to={"/signup"} className="cursor-pointer text-red-500">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
