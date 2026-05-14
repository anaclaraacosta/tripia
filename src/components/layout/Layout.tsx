import { Outlet, useLocation } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden bg-background">
      <TopNavBar />
      <main key={location.pathname} className="flex-1 flex flex-col w-full relative z-10 animate-fade-in-up">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
