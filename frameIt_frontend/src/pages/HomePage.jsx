import clsx from "clsx";
import { useEffect } from "react";

import useAuth from "../context/auth/useAuth.js";
import Card from "../components/Card.jsx";
import useGetPosts from "../hooks/useGetPosts.js";
import useToast from "../context/toast/useToast.js";
import ToastContainer from "../context/toast/ToastContainer.jsx";
import Gallery from "../components/Gallery.jsx";

function HomePage() {
  const { user, initialized } = useAuth();
  const { posts, setPosts, loading, error } = useGetPosts();
  const { showToast } = useToast();

  // message box/toast
  useEffect(() => {
    if (!initialized) return;
    const hasWelcomed = sessionStorage.getItem("hasWelcomed");
    if (hasWelcomed) return;

    sessionStorage.setItem("hasWelcomed", "true");
    showToast("Hello " + (user ? user.username : "Guest") + "!", "success");
  }, []);

  useEffect(() => {
    if (error) {
      showToast(error || "Error fetching posts", "error");
    }
  }, [error]);

  return (
    <div>
      {/* main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Gallery
          posts={posts}
          loading={loading}
          isOwner={false}
          setPosts={setPosts}
        />
      </main>
    </div>
  );
}

export default HomePage;
