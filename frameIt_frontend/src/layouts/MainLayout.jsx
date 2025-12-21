import { Outlet } from "react-router-dom";
import SideNavigation from "../components/SideNavigation.jsx";

function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block min-h-screen shadow-lg border-2 border-gray-100 w-18 lg:w-22">
        <SideNavigation />
      </div>

      <div className="flex-1 min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
