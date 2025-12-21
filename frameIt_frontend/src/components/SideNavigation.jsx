import clsx from "clsx";
import { Home, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function SideNavigation() {
  return (
    <div className={clsx("", "flex flex-col items-center gap-10")}>
      <Link
        to={"/home"}
        className={clsx(
          "mt-5 bg-white rounded-full p-2 shadow-md",
          "active:scale-[.98] bg-gray-200"
        )}
      >
        <Home size={32} />
      </Link>
      <Link
        to={"/create-post"}
        className={clsx(
          " bg-white rounded-full p-2 shadow-md",
          "active:scale-[.98] bg-gray-200"
        )}
      >
        <Plus size={32} />
      </Link>
    </div>
  );
}
