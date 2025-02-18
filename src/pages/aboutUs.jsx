export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">About BarberSupply Co.</h1>
          <p className="text-xl mb-4">
            Welcome to BarberSupply Co., your one-stop shop for premium
            barbershop equipment and supplies.
          </p>
          <p className="mb-4">
            Founded in 2010, we've been passionate about providing barbers and
            hairstylists with the highest quality tools to perfect their craft.
            Our journey began with a simple idea: to make professional-grade
            barbering equipment accessible to everyone, from seasoned pros to
            enthusiastic beginners.
          </p>
          <p>
            At BarberSupply Co., we believe that great hair starts with great
            tools. That's why we carefully curate our selection of clippers,
            trimmers, scissors, and other essential barber items to ensure you
            have access to the best in the business.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            Our mission is to empower barbers and hairstylists with top-notch
            equipment that enhances their skills and elevates their craft. We
            strive to:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              Offer a comprehensive range of high-quality barbering tools and
              supplies
            </li>
            <li>Provide exceptional customer service and expert advice</li>
            <li>Stay at the forefront of barbering technology and trends</li>
            <li>
              Support both professional barbers and home grooming enthusiasts
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Clippers & Trimmers
              </h3>
              <p>
                Professional-grade clippers and trimmers for precise cuts and
                clean lines.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Scissors & Shears</h3>
              <p>
                High-quality scissors and shears for all your cutting and
                texturizing needs.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Grooming Products</h3>
              <p>
                A wide range of styling products, beard care essentials, and
                more.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside">
            <li>Curated selection of top brands and innovative products</li>
            <li>Competitive prices and regular promotions</li>
            <li>Expert advice and responsive customer support</li>
            <li>Fast and reliable shipping</li>
            <li>Satisfaction guarantee on all our products</li>
          </ul>
        </section>

        {/* <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Barbering Game?</h2>
          <p className="mb-6">
            Explore our wide range of professional barbering equipment and take your skills to the next level.
          </p>
          <button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </button>
        </section> */}
      </main>
    </div>
  );
}
