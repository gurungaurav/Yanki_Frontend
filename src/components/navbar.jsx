import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import useUserStore from "../store/useUserStore";
import yanki from "../assets/yanki-.png";
import { FaRegUser } from "react-icons/fa6";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const logOutUser = useUserStore((state) => state.deleteUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Products",
      link: "/products",
    },
    {
      name: "About",
      link: "/about-us",
    },
    {
      name: "Contact",
      link: "/contact-us",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false); // Close dropdown after navigating
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between shadow bg-white px-5 py-2 sm:px-10 md:px-20 brder-b border-gray-200">
      <Link to="/" className=" ">
        <img
          className="w-[5rem] h-[5rem] object-cover"
          src={yanki}
          alt="logo"
        />
      </Link>

      <div className="flex gap-10">
        {navLinks.map((nav) => (
          <Link
            key={nav.name}
            to={nav.link}
            className={`${
              location.pathname === nav.link &&
              "border-b-2 border-black font-semibold "
            } hover:font-semibold duration-300`}
          >
            {nav.name}
          </Link>
        ))}
      </div>

      <div className="flex w-[20rem] items-center justify-end">
        <div className="relative flex items-center gap-4 text-2xl">
          <FaShoppingCart
            onClick={() => navigate("/product/cart")}
            className="cursor-pointer  hover:text-neutral-600 duration-300"
          />
          <div
            onClick={handleDropdownToggle}
            className="rounded-full bg-gray-200 w-10 h-10 p-2 flex items-center justify-center cursor-pointer"
          >
            {user ? (
              <p className="text-base">{user.username[0]?.toUpperCase()}</p>
            ) : (
              <FaRegUser className="text-xl" />
            )}
          </div>

          {isDropdownOpen && (
            <div className="absolute -left-10 mt-40 w-40 bg-white shadow-md rounded-md border border-gray-200">
              <ul className="text-sm">
                {user ? (
                  <>
                    <li
                      className="hover:bg-gray-200 px-4 py-2 cursor-pointer"
                      onClick={() => handleNavigate(`/profile`)}
                    >
                      Profile
                    </li>
                    <li
                      className="hover:bg-gray-200 px-4 py-2 cursor-pointer"
                      onClick={() => handleNavigate(`/product/order-list`)}
                    >
                      Orders
                    </li>
                    <li
                      className="hover:bg-gray-200 px-4 py-2 cursor-pointer"
                      onClick={() => logOutUser()}
                    >
                      Logout
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className="hover:bg-gray-200 px-4 py-2 cursor-pointer"
                      onClick={() => handleNavigate("/login")}
                    >
                      Login
                    </li>
                    <li
                      className="hover:bg-gray-200 px-4 py-2 cursor-pointer"
                      onClick={() => handleNavigate("/register")}
                    >
                      Register
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
