import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Elevate Your Barbering Game
        </h1>
        <p className="text-xl mb-8">
          Discover premium tools for the perfect cut, every time.
        </p>
        <Link
          to=""
          className="bg-black hover:bg-neutral-950 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 inline-block"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
