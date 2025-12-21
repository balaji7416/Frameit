import clsx from "clsx";
import {
  Search,
  Menu,
  User,
  Heart,
  Plus,
  ImageIcon,
  LogOut,
  Home,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import useAuth from "../../context/auth/useAuth.js";
import useToast from "../../context/toast/useToast.js";
import { useNavigate } from "react-router";

function NavbarMobile() {
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();
  const searchRef = useRef();

  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  {
    /*menu close on outside click */
  }
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  {
    /*onscroll menu close */
  }
  useEffect(() => {
    const handleScroll = () => {
      setShowMenu(false);
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        "flex items-center gap-3 sm:gap-5  p-2 ",
        "shadow-lg border-b-2 border-gray-100"
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-1 flex-1 rounded-md bg-gray-100"
        )}
      >
        <button className={clsx("p-1  rounded-l-md")}>
          <Search className={clsx("text-gray-300")} size={20} />
        </button>

        <input
          type="text"
          placeholder="Search..."
          ref={searchRef}
          onChange={(e) => {
            if (!user) {
              e.preventDefault();
              showToast("Please login to search", "info");
              e.target.value = "";
            }
          }}
          className={clsx(
            "flex-1 px-3 py-2 rounded-r-md text-sm sm:text-base ",
            "outline-none"
          )}
        />
      </div>

      {/*menu on smaller screens */}
      {user && (
        <div className="relative bg-gray-100" ref={menuRef}>
          <Menu
            className={clsx("font-bold text-gray-800")}
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {/* menu options */}
          {showMenu && (
            <div
              className={clsx(
                "absolute top-full right-1/2 flex flex-col items-center gap-2 bg-white z-50",
                "w-[300px] rounded-md shadow-md"
              )}
            >
              <Link
                to={"/home"}
                className={clsx(
                  "flex items-center justify-center gap-5 p-2 w-full",
                  "text-gray-800 font-bold  active:scale-[.98] cursor-pointer border-b border-gray-300"
                )}
                onClick={() => setShowMenu(false)}
              >
                <Home />
                <span className="text-center">Home</span>
              </Link>
              <Link
                to={`/create-post`}
                onClick={() => setShowMenu(false)}
                className={clsx(
                  "flex items-center justify-center gap-5 p-2 w-full",
                  "text-gray-800 font-bold  active:scale-[.98] cursor-pointer border-b border-gray-300"
                )}
              >
                <Plus />
                <span className="text-center">Create Post</span>
              </Link>

              <Link
                to={`/posts/${user?._id}`}
                onClick={() => setShowMenu(false)}
                className={clsx(
                  "flex items-center justify-center gap-5 p-2 w-full",
                  "text-gray-800 font-bold  active:scale-[.98] cursor-pointer border-b border-gray-300"
                )}
              >
                <ImageIcon />
                <span className="text-center">My Posts</span>
              </Link>
              <button
                className={clsx(
                  "flex items-center justify-center gap-5 p-2  w-full",
                  "text-gray-800 font-bold  active:scale-[.98] cursor-pointer"
                )}
                onClick={handleLogOut}
              >
                <LogOut />
                <span className="text-center">Log Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NavbarMobile;
