import clsx from "clsx";
import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import useGetPost from "../hooks/useGetPost";
import Gallery from "../components/Gallery";
import useGetPosts from "../hooks/useGetPosts.js";
import useComment from "../hooks/useComment.js";
import useToast from "../context/toast/useToast.js";
import useAuth from "../context/auth/useAuth.js";
import useToggleLike from "../hooks/useToggleLike.js";
import useDownloadPosts from "../hooks/useDownloadPosts.js";
import { Heart, MessageCircle, MoreHorizontal, Download } from "lucide-react";
import Card from "../components/Card.jsx";

function PostViewPage() {
  const { user } = useAuth();

  const { downloadPost } = useDownloadPosts();
  const { toggleLikePost } = useToggleLike();
  const commentRef = useRef(null);
  const { id } = useParams();
  const { loading: postLoading, post } = useGetPost(id);
  const { posts, loading: postsLoading } = useGetPosts();
  const [showComments, setShowComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const { showToast } = useToast();
  const [localComments, setLocalComments] = useState([]);
  const { loading: commentLoading, commentPost } = useComment(post?._id);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const [showPostOptions, setShowPostOptions] = useState(false);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((p) => p._id !== id);
  }, [posts, id]);

  // update local comments when post is fetched
  useEffect(() => {
    if (post?.comments) {
      setLocalComments(post?.comments);
    }
  }, [post]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast("comment cannot be empty", "error");
      return;
    }

    const optimisticComment = {
      _id: Date.now(),
      content: comment,
      author: {
        username: user?.username || "You",
      },
    };

    setLocalComments((prev) => [optimisticComment, ...prev]);
    setComment("");

    try {
      await commentPost(id, comment);
    } catch (err) {
      console.log("error while commenting in PostViewPage: ", err);
      showToast(
        err?.response?.data?.message || err?.message || "error commenting",
        "error"
      );
    }
  };

  //intial values of likes and isliked
  useEffect(() => {
    if (!post || !user) return;
    setIsLiked(post.likes.includes(user._id));
    setLikes(post.likes.length);
  }, [post, user]);

  //handle like post
  const handleToggleLike = async () => {
    const prevLikes = likes;
    const prevIsLiked = isLiked;

    try {
      setLikes((likes) => (isLiked ? likes - 1 : likes + 1));
      setIsLiked((isLiked) => !isLiked);
      const res = await toggleLikePost(post._id);
      setIsLiked(res.includes(user._id));
    } catch (err) {
      console.log("error while liking post: ", err);
      setLikes(prevLikes);
      setIsLiked(prevIsLiked);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadPost(post?.image, `${post?.title}.jpg`);
      showToast("Image downloaded successfully", "success");
    } catch (err) {
      console.log("error while downloading post: ", err);
      showToast("Error downloading image", "error");
    }
  };

  return (
    <div
      className={clsx(
        "min-h-screen p-3 sm:p-5 md:p-7",
        "flex flex-col items-center gap-5",
        "bg-white"
      )}
    >
      <div className={clsx("flex gap-2 lg:gap-5 w-full", "")}>
        <div
          className={clsx(
            "relative w-full lg:w-3/5 min-h-[600px] flex flex-col gap-2 p-2",
            "rounded-md shadow-md bg-white border-2 border-gray-100"
          )}
        >
          <div
            className={clsx(
              "bg-white w-full h-1/10",
              "flex items-center justify-evenly p-3 "
            )}
          >
            <button
              className=" flex items-center gap-2 cursor-pointer active:scale-[.98]"
              onClick={handleToggleLike}
            >
              <Heart
                className={clsx(
                  " font-bold h-7 w-7 md:h-8 w-8",
                  isLiked
                    ? "text-red-600 fill-red-600"
                    : "text-gray-600 fill-none"
                )}
              />
              <h1
                className={clsx("font-bold text-sm sm:text-base text-gray-800")}
              >
                {likes}
              </h1>
            </button>
            <button
              className=" flex items-center gap-2 "
              onClick={() => {
                commentRef?.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                setTimeout(() => {
                  commentRef?.current?.focus();
                }, 500);
              }}
            >
              <MessageCircle
                className={clsx(
                  "font-bold h-7 w-7 md:h-8 w-8 text-gray-600 cursor-pointer active:scale-[.98]"
                )}
              />
              <h1>{localComments?.length}</h1>
            </button>
            <div
              className="relative"
              onClick={() => setShowPostOptions((prev) => !prev)}
            >
              <button className=" flex items-center gap-2">
                <MoreHorizontal
                  className={clsx(
                    " font-bold h-7 w-7 md:h-8 w-8 text-gray-600 "
                  )}
                />
              </button>
              {showPostOptions && (
                <div
                  className={clsx(
                    "flex flex-col gap-2 mt-4",
                    "absolute top-full right-0 w-[220px] md:w-[300px] z-10 bg-white",
                    "p-2 rounded-md shadow-md",
                    "text-sm md:text-base text-gray-800"
                  )}
                >
                  <button
                    className={clsx(
                      "flex items-center justify-center gap-5 border-b border-gray-300 p-1 md:p-2",
                      "text-gray-800 font-bold  active:scale-[.98] cursor-pointer"
                    )}
                    onClick={handleDownload}
                  >
                    {" "}
                    <Download /> Download
                  </button>
                  {/* <button
                    className={clsx(
                      "flex items-center justify-center gap-5 p-1 md:p-2",
                      "text-gray-800 font-bold  active:scale-[.98] cursor-pointer"
                    )}
                  >
                    {" "}
                    <Heart /> Favourite
                  </button> */}
                </div>
              )}
            </div>
          </div>

          {/* Image */}
          <motion.div
            layout="position"
            transition={{
              layout: {
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
            className={clsx(
              // "w-full shrink-0 h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden p-2",
              "w-full  p-2",
              "rounded-md",
              "flex items-center justify-center border-2 border-gray-200"
            )}
          >
            {postLoading ? (
              <div className="animate-pulse h-full w-full rounded-md"></div>
            ) : (
              <motion.img
                src={post?.image}
                alt={post?.title}
                layoutId={`post-image-${post?._id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.3, 1],
                }}
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            )}
          </motion.div>

          <div
            className={clsx(
              "bg-white rounded-md px-3 py-1 space-y-2 min-w-0",
              postLoading ? "hidden" : ""
            )}
          >
            {/* Preview */}
            <h1 className="font-semibold text-base md:text-lg line-clamp-1 break-all overflow-hidden">
              {post?.title}
            </h1>

            <div
              className={clsx(
                "text-sm text-gray-700 transition-all break-all overflow-hidden ",
                showFullContent
                  ? "max-h-[200px] overflow-y-auto"
                  : "line-clamp-2"
              )}
            >
              {post?.content}
            </div>

            {/* View more */}
            <button
              onClick={() => setShowFullContent((p) => !p)}
              className="text-blue-600 text-sm font-medium"
            >
              {showFullContent ? "View less" : "View more"}
            </button>
          </div>

          {/* comment section */}
          <div
            className={clsx(
              "bg-white rounded-md p-3 space-y-3",
              postLoading ? "hidden" : ""
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">
                Comments ({localComments.length || 0})
              </h2>
              <button
                onClick={() => setShowComments((p) => !p)}
                className="text-blue-600 text-sm"
              >
                {showComments ? "Hide" : "View more"}
              </button>
            </div>

            {/* Comment input */}
            <form className="flex gap-2" onSubmit={handleComment}>
              <input
                type="text"
                value={comment}
                ref={commentRef}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className={clsx(
                  "flex-1 border border-gray-300 rounded-md px-3 py-1 sm:py-2 text-sm outline-none",
                  "focus:ring-1 focus:ring-blue-500",
                  "transition-all duration-150 ease-in-out"
                )}
                disabled={commentLoading}
              />
              <button
                className="bg-blue-600 text-white px-3 rounded-md text-sm"
                type="submit"
              >
                Post
              </button>
            </form>

            {/* Comments list */}
            {showComments && (
              <div
                className={clsx(
                  "max-h-[250px] overflow-y-auto space-y-2  pt-2",
                  "flex flex-col gap-1"
                )}
              >
                {localComments.map((comment) => (
                  <div
                    key={comment?._id}
                    className={clsx(
                      "flex flex-col justify-between",
                      "text-sm",
                      "border-b border-gray-200",
                      "p-1 sm:p-2 rounded-md"
                    )}
                  >
                    <span className="font-medium">
                      {comment?.author?.username === user?.username
                        ? "You"
                        : comment?.author?.username}
                    </span>
                    <p className="text-gray-700">{comment?.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={clsx(
            "shadow-md rounded-md hidden lg:flex w-2/5 min-h-[800px]"
          )}
        ></div>
      </div>
      <div>
        <Gallery posts={filteredPosts} loading={postsLoading} isOwner={false} />
      </div>
    </div>
  );
}

export default PostViewPage;
