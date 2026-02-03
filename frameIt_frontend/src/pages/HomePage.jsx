// React and core libraries
import { useEffect } from "react";

// Third-party libraries
import clsx from "clsx";

//custom hooks / context
import useAuth from "../context/auth/useAuth.js";
import useGetPosts from "../hooks/useGetPosts.js";
import useToast from "../context/toast/useToast.js";

//components
import Gallery from "../components/Gallery.jsx";

function HomePage() {
  //Environment / context
  const { showToast } = useToast();
  const { user, authInitialized } = useAuth();

  //Data fetching
  const { posts, setPosts, postsLoading, postsFetchingError } = useGetPosts({});

  // side Effects: Welcome toast on first visit
  useEffect(() => {
    if (!authInitialized) return;
    const hasWelcomed = sessionStorage.getItem("hasWelcomed");
    if (hasWelcomed) return;

    sessionStorage.setItem("hasWelcomed", true);
    showToast("Hello " + (user ? user.username : "Guest") + "!", "success");
  }, [authInitialized, user, showToast]);

  // side Effects: postsFetchingError toast
  useEffect(() => {
    if (postsFetchingError) {
      showToast(
        postsFetchingError || "postsFetchingError fetching posts",
        "postsFetchingError",
      );
    }
  }, [postsFetchingError, showToast]);

  return (
    <div>
      {/* main content */}
      <main className={clsx("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6")}>
        <Gallery
          posts={posts}
          loading={postsLoading}
          isOwner={false}
          setPosts={setPosts}
        />
      </main>
    </div>
  );
}

export default HomePage;
