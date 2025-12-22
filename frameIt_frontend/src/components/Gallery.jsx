import Masonry from "react-masonry-css";
import Card from "./Card.jsx";
import { useState } from "react";
import useToast from "../context/toast/useToast.js";
import useDeletePost from "../hooks/useDeletePosts.js";
import useDownloadPosts from "../hooks/useDownloadPosts.js";

export default function Gallery({ posts, loading, isOwner, setPosts }) {
  const breakpointColumnsObj = {
    default: 5,
    1200: 4,
    768: 3,
    500: 2,
  };

  // for card options popup
  const [openMenuId, setOpenMenuId] = useState(null);
  const { showToast } = useToast();

  const { loading: downloadLoading, downloadPost } = useDownloadPosts();

  const { loading: deleteLoading, deletePost } = useDeletePost();

  const handleDelete = async (postId) => {
    if (deleteLoading) showToast("Deletion in progress...", "info");
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      showToast("Post deleted successfully", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleDownload = async (imageUrl, filename) => {
    try {
      await downloadPost(imageUrl, filename);
      if (loading) showToast("Download in progress...", "info", 1000);
      showToast("Post downloaded successfully", "success");
    } catch (err) {
      showToast(`Error downloading post: ${err.message}`, "error");
    }
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="flex h-screen items-start justify-center pt-10   text-sm sm:text-lg md:text-xl font-semibold text-gray-800">
        No posts found . . .
      </div>
    );
  }
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex gap-4"
      columnClassName="masonry-grid_column"
    >
      {(loading ? Array.from({ length: 10 }) : posts).map((post, idx) => (
        <Card
          _id={post?._id}
          key={post?._id || idx}
          img_url={post?.image}
          title={post?.content}
          loading={loading}
          isOwner={isOwner}
          isOpen={openMenuId === post?._id}
          onToggle={() =>
            setOpenMenuId(openMenuId === post?._id ? null : post?._id)
          }
          onDelete={() => handleDelete(post?._id)}
          onDownload={() => handleDownload(post?.image, `${post?._id}.jpg`)}
          downloadLoading={downloadLoading}
        />
      ))}
    </Masonry>
  );
}
