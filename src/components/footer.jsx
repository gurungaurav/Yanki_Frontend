import { Link } from "react-router-dom";
import yanki from "../assets/yanki-.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img
              src={yanki}
              alt="BarberSupply"
              className="w-20 object-cover h-20 mb-4"
            />

            <p className="text-gray-400 text-sm">
              Premium barber supplies for professionals and enthusiasts.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Clippers & Trimmers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Scissors & Shears
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Razors & Blades
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Grooming Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="my-8 bg-gray-800 shrink-0 bg-border h-[1px] w-full">
          {" "}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 BarberSupply. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
