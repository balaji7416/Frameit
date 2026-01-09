import clsx from "clsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import useUpload from "../hooks/useUpload.js";
import useToast from "../context/toast/useToast.js";
import Spinner from "../components/Spinner.jsx";
import { Camera, ArrowLeftIcon } from "lucide-react";

function CreatePostPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { showToast } = useToast();
  const { uploadPost, loading } = useUpload();

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && !image && !title) {
      showToast("Please add title, content and an image", "error");
      return;
    } else if (!title) {
      showToast("Please add title", "error");
      return;
    } else if (!content) {
      showToast("Please add content", "error");
      return;
    } else if (!image) {
      showToast("Please add an image", "error");
      return;
    }

    try {
      showToast("Uploading post...", "info");
      await uploadPost({ title, content, image });
      showToast("Post uploaded successfully", "success");

      setContent("");
      setImage(null);
      fileRef.current.value = null;
      if (!loading) navigate("/home");
    } catch (err) {
      showToast(err?.message || "Error uploading post", "error");
      console.log("Error uploading post: ", err);
    }
  };
  return (
    <div
      className={clsx(
        "h-screen flex items-center justify-center p-3 sm:p-5 md:p-7"
      )}
    >
      <button
        className={clsx(
          "absolute top-1/4 left-5 md:top-1/4 md:left-1/4",
          "bg-gray-100 px-2 py-1 sm::px-5 sm:py-2 rounded-md shadow-md",
          "font-bold"
        )}
        onClick={() => navigate("/", { replace: true })}
      >
        <ArrowLeftIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 w-10" />
      </button>
      <form
        className={clsx(
          "flex flex-col justify-evenly items-center gap-3",
          "rounded-md shadow-md p-3 sm:p-5 md:p-7",
          "w-full sm:max-w-130 md:max-w-140",
          "bg-gray-50"
        )}
        onSubmit={handleSubmit}
      >
        <h1 className={clsx("text-lg sm:text-xl md:text-2xl font-bold")}>
          Upload your post
        </h1>

        <div className={clsx(" flex flex-col w-full gap-1")}>
          <p className={clsx("text-sm font-semibold")}>Title</p>
          <input
            type="text"
            value={title}
            disabled={loading}
            onChange={(e) => setTitle(e.target.value)}
            className={clsx(
              "p-2 rounded-md border border-gray-300 outline-none",
              "focus:border-transparent focus:ring-2 focus:ring-blue-500",
              "transition-all duration-150"
            )}
          />
          <p className={clsx("text-sm font-semibold")}>Content</p>
          <textarea
            type="text"
            value={content}
            disabled={loading}
            onChange={(e) => setContent(e.target.value)}
            className={clsx(
              "p-2 rounded-md border border-gray-300 outline-none",
              "focus:border-transparent focus:ring-2 focus:ring-blue-500",
              "transition-all duration-150"
            )}
          />
        </div>

        {/* image upload button */}
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className={clsx("p-3 rounded-md border border-gray-300")}
        >
          <Camera size={40} />
        </button>
        {/* image preview */}
        {preview && (
          <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-300">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <input
          type="file"
          className={clsx(" hidden")}
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          disabled={loading}
          ref={fileRef}
        />
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            "w-3/4 px-5 py-2 rounded-md",
            "bg-blue-600 text-sm sm:text-base text-white font-semibold",
            "focus:bg-blue-500 active:scale-[.98]",
            "transition-all duration-150 ease-out"
          )}
        >
          {loading ? <Spinner type="sm" /> : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
