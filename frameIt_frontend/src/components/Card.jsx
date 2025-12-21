import clsx from "clsx";
import { MoreHorizontal, Download, Heart, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Card({
  img_url,
  title,
  _id,
  alt,
  loading,
  isOwner,
  isOpen,
  onToggle,
  onDelete,
  onDownload,
  downloadLoading,
}) {
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  {
    /* close popup when clicking outside */
  }
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

  // {
  //   /* close popup when scrolling */
  // }
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (isOpen) {
  //       onToggle();
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [isOpen, onToggle]);

  if (loading) {
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
      <div className="rounded-md overflow-hidden rounded-md shadow-md focus:scale-[1.02] active:scale-[.98]">
        <img
          src={img_url}
          alt={alt}
          loading="lazy"
          className="w-full object-cover rounded-md shadow-md"
          onClick={() => navigate(`/post/${_id}`)}
        />
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
              "text-sm sm:text-base"
            )}
            ref={popupRef}
          >
            <button
              className={clsx(
                "flex items-center justify-center gap-5 p-2 border-b border-gray-300",
                "text-gray-800 font-bold  active:scale-[.98] cursor-pointer "
              )}
              onClick={onDownload}
              disabled={downloadLoading}
            >
              <Download size={15} /> Download
            </button>
            {/* <button
              className={clsx(
                "flex items-center justify-center gap-5 p-2",
                "text-gray-800 font-bold  active:scale-[.98] cursor-pointer"
              )}
            >
              <Heart size={15} /> Favourite
            </button> */}
            {isOwner && (
              <button
                className={clsx(
                  "flex items-center justify-center gap-5 p-2",
                  "text-gray-800 font-bold  active:scale-[.98] cursor-pointer"
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
