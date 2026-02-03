// React & core libraries
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Third-party libraries
import clsx from "clsx";
import { MoreHorizontal, Download, Heart, Trash2 } from "lucide-react";
import { motion } from "motion/react";

export default function Card({
  post,
  posts,
  postLoading,
  isOwner,
  isOpen,
  onToggle,
  onDelete,
  onDownload,
  downloadLoading,
}) {
  // derived states and refs
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  // actions
  const navigate = useNavigate();

  // actions: close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        onToggle();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // handlers: image click
  const handleImageClick = () => {
    if (postLoading) return;

    navigate(`/post/${post?._id}`, {
      state: { post, posts },
    });
  };

  //handle loading state
  if (postLoading) {
    return (
      <div className={clsx("mb-4 rounded-md ", "animate-pulse")}>
        {/* skeleton UI here */}
        <div className="bg-gray-200 h-64 w-full rounded-md"></div>
        <div className="mt-2 h-4 w-3/4 bg-gray-300 rounded" />
      </div>
    );
  }

  return (
    <div className={clsx("mb-4 rounded-mdflex flex-col gap-2", "")}>
      <div
        className={clsx(
          "rounded-md overflow-hidden shadow-md",
          " focus:scale-[1.05] active:scale-[.98] cursor-pointer hover:scale-[1.01]",
          "transition-all duration-150 ease-in-out",
        )}
      >
        {/* post image */}
        <motion.img
          src={post?.image}
          alt={post?.title || "Post Image"}
          layoutId={`post-image-${post?._id}`}
          className="w-full object-cover rounded-md shadow-md"
          onClick={handleImageClick}
        ></motion.img>
      </div>

      <div className="relative">
        <button
          className="hover:bg-gray-100 rounded-md p-1 active:bg-gray-200"
          ref={buttonRef}
          onClick={onToggle}
        >
          <MoreHorizontal size={15} />
        </button>
        {/* card options popup */}
        {isOpen && (
          <div
            className={clsx(
              "absolute top-full w-full",
              " bg-gray-100 border-2 border-gray-300 rounded-md shadow-lg",
              "flex flex-col gap-1 p-1 z-50",
              "text-sm sm:text-base",
            )}
            ref={popupRef}
          >
            <button
              className={clsx(
                "flex items-center justify-center gap-5 p-2 border-b border-gray-300",
                "text-gray-800 font-bold  active:scale-[.98] cursor-pointer ",
              )}
              onClick={onDownload}
              disabled={downloadLoading}
            >
              <Download size={15} /> Download
            </button>
            {isOwner && (
              <button
                className={clsx(
                  "flex items-center justify-center gap-5 p-2",
                  "text-gray-800 font-bold  active:scale-[.98] cursor-pointer",
                )}
                onClick={onDelete}
              >
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
