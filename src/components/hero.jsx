import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gray-900 text-white py-28">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Your Ultimate Barber Shop Supply Store
        </h1>
        <p className="text-lg mb-8">
          Explore our wide range of premium barber tools and accessories. From
          clippers to scissors, we have everything you need to elevate your
          craft.
        </p>
        <Link
          to="/products"
          className="bg-black hover:bg-neutral-950 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 inline-block"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
