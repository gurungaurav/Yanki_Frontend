import { ToastContainer } from "react-toastify";
import Router from "./routes/index.routes";

function App() {
  return (
    <div className="font-sans">
      <Router />
      <ToastContainer />
    </div>
  );
}

export default App;
