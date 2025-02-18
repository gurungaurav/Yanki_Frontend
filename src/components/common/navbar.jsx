import useUserStore from "../../store/useUserStore";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCartPlus, FaUser } from "react-icons/fa";
import { Search } from "lucide-react";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  console.log(user, "dssd");

  const navigate = useNavigate();
  const location = useLocation();
  // const { width } = useWindow();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

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

  const handleNavigate = () => {
    if (user) {
      navigate(`/profile/${user}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between shadow-md bg-white px-5 py-4 sm:px-10 md:px-20">
      <Link to="/" className="h-[3rem] w-[6rem] md:h-[4rem] md:w-[8rem]">
        {/* <img alt="logo" className="h-full w-full object-cover" src={bill}></img> */}
        <h1>Yanki</h1>
      </Link>
      {/* {width >= 768 ? ( */}
      <>
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
          <div className="flex items-center gap-4 text-2xl">
            {/* <Search /> */}
            <FaUser onClick={handleNavigate} className="cursor-pointer" />
            {/* <ModeToggle /> */}
            {/* <SideCart />
            <SearchBar /> */}
            <FaCartPlus
              onClick={() => navigate("/product/cart")}
              className="cursor-pointer"
            />
            <Search />
          </div>
        </div>
      </>
      {/* ) : (
        <span className="flex gap-6">
          <SideCart />
          <Sidebar navLinks={navLinks} />
        </span>
      )} */}
    </div>
  );
}

// function SearchBar() {
//   const [filters, setFilters] =
//     useState <
//     {
//       searchName,
//     } >
//     "";
//   const [value, setValue] = useState < string > "";

//   const { debounceValue } = useDebounce(value);

//   const { data, isLoading } = useGetClientFilterProductsQuery({
//     filters,
//     isEnabled: !!filters?.searchName,
//   });

//   useEffect(() => {
//     if (debounceValue) {
//       setFilters({ searchName: debounceValue });
//     } else {
//       setFilters({});
//     }
//   }, [debounceValue]);

//   return (
//     <form action="" className="relative">
//       <input
//         type="search"
//         placeholder="Search clothes"
//         onChange={(e) => setValue(e.target.value)}
//         className="peer relative z-10 h-10 w-6 cursor-pointer rounded-full bg-transparent pl-10 text-sm font-semibold outline-none transition-all duration-300 ease-in-out focus:w-full focus:cursor-text focus:border focus:border-neutral-700 focus:pl-14 focus:pr-2"
//       />
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="absolute inset-y-0 my-auto h-9 w-12 border-r border-transparent stroke-black px-3 transition-all duration-300 ease-in-out peer-focus:border-neutral-700 peer-focus:stroke-neutral-700"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <path
//           strokeLinecap="round" // Use camelCase
//           strokeLinejoin="round" // Use camelCase
//           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//         />
//       </svg>
//       {debounceValue && (
//         <div className="absolute z-10 flex h-[20rem] w-full flex-col gap-2 rounded-md border bg-gray-100 p-2">
//           {isLoading ? (
//             <p>Loading...</p>
//           ) : data && data?.data?.products?.length > 0 ? (
//             data?.data.products.map((product) => (
//               <div className="flex items-center gap-2" key={product.productId}>
//                 <img
//                   src={product.variants[0].images[0].url}
//                   className="h-10 w-10 object-cover"
//                   alt="pic"
//                 />
//                 <p className="text-sm font-semibold">{product.name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No products found</p>
//           )}
//         </div>
//       )}
//     </form>
//   );
// }
