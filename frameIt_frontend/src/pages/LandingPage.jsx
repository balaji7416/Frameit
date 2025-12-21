import clsx from "clsx";
import LandingPageBgImg from "../assets/bg_img_landing_page.jpg";
import { Link } from "react-router";
import { Navigate } from "react-router";
import useAuth from "../context/auth/useAuth.js";

function LandingPage() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/home" replace />;
  }
  return (
    //page container
    <div
      className={clsx(
        "min-h-screen flex items-center justify-center",
        "w-full p-3 sm:p-5 md:p-7",
        ""
      )}
    >
      {/* main content */}
      <div
        className={clsx(
          "w-full sm:max-w-[600px] md:max-w-[800px] p-3 sm:p-5 md:p-7",
          "flex flex-col items-center justify-evenly",
          ""
        )}
      >
        <h1
          className={clsx(
            " text-center text-base sm:text-xl md:text-3xl font-bold tracking-wide mb-3 sm:mb-5 md:mb-7"
          )}
        >
          Turn sparks of inspiration into boards you love
        </h1>
        <h2
          className={clsx(
            "text-base sm:text-xl md:text-3xl font-semibold mb-10 sm:mb-20 md:mb-30"
          )}
        >
          Let's get you started
        </h2>

        <Link
          to={"/auth"}
          className={clsx(
            " w-full  px-3 py-2 sm:px-5 sm:py-3 rounded-md",
            "bg-blue-600 text-sm sm:text-base text-white font-semibold text-center",
            "focus:bg-blue-500 active:scale-[.98]",
            "transition-all duration-150 ease-out"
          )}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
