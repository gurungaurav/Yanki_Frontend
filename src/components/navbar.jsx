import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCartPlus, FaUser } from "react-icons/fa";
import useUserStore from "../store/useUserStore";

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
    <div className="sticky top-0 z-50 flex items-center justify-between shadow bg-white px-5 py-4 sm:px-10 md:px-20">
      <Link to="/" className="h-[3rem] w-[6rem] md:h-[4rem] md:w-[8rem]">
        <h1>Yanki</h1>
      </Link>

      <div className="flex gap-10">
        {navLinks.map((nav) => (
          <Link
            key={nav.name}
            to={nav.link}
            className={`${
              location.pathname === nav.link &&
              "border-b-2 border-black font-semibold"
            }`}
          >
            {nav.name}
          </Link>
        ))}
      </div>

      <div className="flex w-[20rem] items-center justify-end">
        <div className="relative flex items-center gap-4 text-2xl">
          <div
            onClick={handleDropdownToggle}
            className="rounded-full bg-gray-200 w-10 h-10 p-2 flex items-center justify-center cursor-pointer"
          >
            {user ? (
              <p className="text-base">{user.username[0]}</p>
            ) : (
              <FaUser className="text-xl" />
            )}
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-28 w-40 bg-white shadow-md rounded-md border border-gray-200">
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

          <FaCartPlus
            onClick={() => navigate("/product/cart")}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
