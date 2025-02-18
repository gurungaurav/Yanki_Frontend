import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";

function HomeLayout({ children }) {
  return (
    <div className="">
      <div>
        <Navbar />
        {children}
      </div>
      <Footer />
    </div>
  );
}
export default HomeLayout;
