import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { SiShopify } from "react-icons/si";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 text-yellow-50 px-3 py-4 md:px-5 2xl:px-8 md:py-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex items-center gap-1">
            <SiShopify className="text-sm md:text-2xl" />
            <h1 className="text-sm md:text-xl 2xl:text-2xl">Shopsy</h1>
          </div>

          <p className="text-xs md:text-sm lg:text-base leading-relaxed">
            Your one-stop destination for quality products at great prices.
            <br />
            Shop smarter, live better.
          </p>

          <div className="flex flex-wrap gap-2 items-center">
            <h1 className="text-xs md:text-base">Connect with us - </h1>

            <div className="flex flex-row gap-3 md:gap-3 items-center">
              <button className="cursor-pointer hover:pt-1 transition-all">
                <FaInstagram className="text-base md:text-xl" color="pink" />
              </button>

              <button className="cursor-pointer hover:pt-1 transition-all">
                <FaFacebook className="text-base md:text-xl" color="blue" />
              </button>

              <button className="cursor-pointer hover:pt-1 transition-all">
                <FaXTwitter className="text-base md:text-xl" color="skyblue" />
              </button>

              <button className="cursor-pointer hover:pt-1 transition-all">
                <FaYoutube className="text-base md:text-xl" color="red" />
              </button>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-40 gap-y-5 md:gap-10 lg:gap-18 2xl:gap-18 py-3 md:py-0">
          <div className="flex flex-col gap-2 md:gap-2">
            <h1 className="text-sm md:text-base 2xl:text-lg">Quick Links</h1>

            <ul className="flex flex-col items-start gap-2 md:gap-1.5 ml-3 md:ml-4 text-xs md:text-xs 2xl:text-sm">
              <li>
                <Link
                  to={"/"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="cursor-pointer hover:pl-2 transition-all"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to={"/orders"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="cursor-pointer hover:pl-2 transition-all"
                >
                  Orders
                </Link>
              </li>

              <li>
                <Link
                  to={"/cart"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="cursor-pointer hover:pl-2 transition-all"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 md:gap-2">
            <h1 className="text-sm md:text-base 2xl:text-lg">My Account</h1>

            <ul className="flex flex-col items-start gap-2 md:gap-1.5 ml-3 md:ml-4 text-xs md:text-xs 2xl:text-sm">
              <li>
                <Link
                  to={"/login"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="cursor-pointer hover:pl-2 transition-all"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to={"/signup"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="cursor-pointer hover:pl-2 transition-all"
                >
                  Signup
                </Link>
              </li>

              <li>
                <Link
                  to={"/profile"}
                  onClick={() => window.scrollTo(0, 0)}
                  className="cursor-pointer hover:pl-2 transition-all"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 md:gap-2 md:w-30 2xl:w-35">
            <h1 className="text-sm md:text-base 2xl:text-lg">Legel</h1>

            <ul className="flex flex-col items-start gap-2 md:gap-1.5 ml-3 md:ml-2 text-xs md:text-xs 2xl:text-sm">
              <li>
                <Link className="cursor-pointer hover:pl-2 transition-all">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link className="cursor-pointer hover:pl-2 transition-all">
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link className="cursor-pointer hover:pl-2 transition-all">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 md:gap-2">
            <h1 className="text-sm md:text-base 2xl:text-lg">
              Customer Service
            </h1>

            <ul className="flex flex-col items-start gap-2 md:gap-1.5 ml-3 md:ml-4 text-xs md:text-xs 2xl:text-sm">
              <li>
                <Link className="cursor-pointer hover:pl-2 transition-all">
                  FAQs
                </Link>
              </li>

              <li>
                <Link className="cursor-pointer hover:pl-2 transition-all">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link className="cursor-pointer hover:pl-2 transition-all">
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link className="cursor-pointer hover:pl-2 transition-all">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="border-t mt-2 md:mt-4 pt-2 text-xs md:text-base">
        <p>Developed By Akashdeep Singh</p>
      </div>
    </div>
  );
}
