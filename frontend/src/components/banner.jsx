import { Link } from "react-router-dom";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FaArrowRotateRight } from "react-icons/fa6";
import useAuth from "../context/useAuth";

export default function Banner() {
  const { user } = useAuth();
  return (
    <section className="w-full px-2 py-1 md:p-4 lg:p-4 2xl:px-6">
      <div className="flex overflow-hidden rounded-2xl bg-[#f8f2e8] md:min-h-[300px] lg:min-h-[400px] md:gap-4 2xl:gap-10 ">
        <div className="flex flex-col gap-2 md:gap-1 lg:gap-4 p-3 md:px-5 lg:py-8 md:w-1/2 md:py-4 lg:px-8 2xl:ml-[10px]">
          <div className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <h1 className="text-[7px] md:text-xl lg:text-2xl font-bold text-gray-700">Hello {user?.username || "Guest"}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[6px] md:text-[9px] lg:text-sm font-medium md:tracking-widest text-slate-600">
            <span>NEW SEASON</span>
            <span>•</span>
            <span>NEW STYLES</span>
            <span>•</span>
            <span>JUST FOR YOU</span>
          </div>

          <div className="space-y-1 md:space-y-2 lg:space-y-4">
            <h2 className="text-xs md:text-xl font-extrabold leading-tight text-blue-700 sm:text-4xl lg:text-5xl">
              Up to 50% Off
              <span className="mt-1 block text-xs md:text-2xl lg:text-4xl text-slate-950">
                On Your Favourite Picks
              </span>
            </h2>

            <p className="max-w-lg text-[8px] md:text-sm lg:text-base md:leading-6 text-slate-600">
              Trendy fashion, latest gadgets, home essentials and more. Shop
              smarter, live better.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-1 md:gap-3 rounded-full bg-blue-600 px-1 py-1 md:px-4 md:py-2 lg:px-7 lg:py-3 text-xs md:text-lg lg:text-xl md:font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Shop Now
              <span aria-hidden="true" className="text-xs md:text-lg lg:text-xl">
                →
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-1 gap-y-3 md:pt-2 lg:pt-2 text-[7px] md:text-[10px] lg:text-sm font-medium text-slate-700 md:gap-x-2 lg:gap-x-5">
            <div className="flex items-center gap-0.5 md:gap-2">
              <TbTruckDelivery className="text-[10px] md:text-xl lg:text-2xl" />
              <span className="">Fast Delivery</span>
            </div>

            <div className="hidden h-7 border-l border-slate-300 sm:block" />

            <div className="flex items-center gap-0.5 md:gap-2">
              <RiSecurePaymentFill className="text-[10px] md:text-xl lg:text-2xl" />
              <span>Secure Payments</span>
            </div>

            <div className="hidden h-7 border-l border-slate-300 sm:block" />

            <div className="md:flex items-center gap-0.5 md:gap-2 hidden md:block">
              <FaArrowRotateRight className="text-[10px] md:text-xl lg:text-2xl" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center md:w-1/2 md:self-stretch md:px-2 md:pr-0 md:pb-0 ">
          <img
            src="/images/shopsy-products.png"
            alt="Fashion accessories, sneakers, headphones and electronics"
            className="w-full h-auto lg:max-h-[430px] object-contain 2xl:ml-[250px]"
          />
        </div>
      </div>
    </section>
  );
}
