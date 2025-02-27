import Footer from "../components/footer";
import Navbar from "../components/navbar";

function HomeLayout({ children }) {
  return (
    <div className="">
      <div className="h-full flex flex-col">
        <Navbar />
        {children}
      </div>
      <Footer />
    </div>
  );
}
export default HomeLayout;
