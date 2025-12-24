import { Link, useNavigate } from "react-router";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import useAuth from "../../context/auth/useAuth.js";
import { User, ChevronDown, ChevronUp, Search } from "lucide-react";
import useToast from "../../context/toast/useToast.js";

function Navbar() {
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // handle search
  const handleSearch = async () => {
    try {
      setSearchQuery("");
      navigate(`/search?query=${searchQuery}`);
    } catch (err) {
      console.log("Error in handleSearch: ", err);
    }
  };

  {
    /*handle user popup on outside click */
  }
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setOpenUserMenu(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [openUserMenu]);

  {
    /* close menu on scroll */
  }
  useEffect(() => {
    const handleScroll = () => {
      if (openUserMenu) {
        setOpenUserMenu(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [openUserMenu]);

  const handleLogOut = async () => {
    try {
      showToast("Logging out...", "info");
      await logout();
      navigate("/", { replace: true });
      showToast("Logged out successfully", "success");
    } catch (err) {
      console.log("Logout Failed: ", err);
      showToast("Logout Failed", "error");
    }
  };

  return (
    <div
      className={clsx(
        "relative flex items-center justify-between gap-5 lg:gap-8",
        "px-3 py-2",
        "shadow-md"
      )}
    >
      {/*menu on larger screens */}
      <h1 className="text-base sm:text-lg md:text-xl font-bold hidden md:block">
        FrameIT
      </h1>
      <form
        className={clsx(
          "flex items-center gap-1 flex-1 rounded-md bg-gray-100"
        )}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <button className={clsx("p-1  rounded-l-md")}>
          <Search className={clsx("text-gray-300")} size={20} />
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            if (!user) {
              e.preventDefault();
              showToast("Please login to search", "info");
              e.target.value = "";
            } else {
              setSearchQuery(e.target.value);
            }
          }}
          className={clsx(
            "flex-1 px-3 py-2 rounded-r-md text-sm sm:text-base ",
            "outline-none"
          )}
        />
      </form>

      {/* user menu */}
      {user && (
        <div
          className={clsx(
            "hidden md:flex max-w-[300px] items-center justify-center gap-3 "
          )}
        >
          {openUserMenu ? (
            <ChevronUp
              size={20}
              className=""
              onClick={() => setOpenUserMenu((prev) => !prev)}
            />
          ) : (
            <ChevronDown
              size={20}
              className=""
              onClick={() => setOpenUserMenu((prev) => !prev)}
            />
          )}

          <div className="relative" ref={userMenuRef}>
            <button
              className={clsx(
                " bg-white rounded-full p-2 shadow-md",
                "active:scale-[.98] bg-gray-200"
              )}
              onClick={() => setOpenUserMenu((prev) => !prev)}
            >
              <User size={25} />
            </button>

            {/* user menu */}
            {openUserMenu && (
              <div
                className={clsx(
                  "absolute top-full right-0",
                  "flex flex-col items-center gap-2 p-3 w-full min-w-[300px]",
                  "bg-white shadow-lg rounded-md border-2 border-gray-100"
                )}
              >
                <Link
                  to={`/posts/${user.username}`}
                  onClick={() => setOpenUserMenu(false)}
                  className={clsx(
                    "border-b-2 border-gray-200 w-full text-center",
                    "font-semibold text-base",
                    "pb-1",
                    "active:bg-gray-100 active:scale-[.98]"
                  )}
                >
                  Posts
                </Link>
                <button
                  onClick={handleLogOut}
                  className={clsx(
                    "border-b-2 border-gray-200 w-full text-center",
                    "font-semibold text-base",
                    "pb-1",
                    "active:bg-gray-100 active:scale-[.98]"
                  )}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <p className="font-semibold text-base">
            {!user && <p className="animate-pulse bg-gray-200"></p>}
            {user && user.username}
          </p>
        </div>
      )}
    </div>
  );
}

export default Navbar;
