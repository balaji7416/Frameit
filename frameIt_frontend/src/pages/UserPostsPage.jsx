import { useEffect } from "react";
import useUserPosts from "../hooks/useUserPosts.js";
import Spinner from "../components/Spinner.jsx";
import Gallery from "../components/Gallery.jsx";
import useAuth from "../context/auth/useAuth.js";
function UserPostsPage() {
  const { user } = useAuth();
  const { loading, error, userPosts, getUserPosts, setUserPosts } =
    useUserPosts(user?.username);

  useEffect(() => {
    getUserPosts(user?.username);
  }, [user?.username]);

  // if (loading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Spinner type="lg" />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        Error fetching user posts: {error}
      </div>
    );
  }

  return (
    <div>
      {/* main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Gallery
          posts={userPosts}
          loading={loading}
          isOwner={true}
          setPosts={setUserPosts}
        />
      </main>
    </div>
  );
}
export default UserPostsPage;
