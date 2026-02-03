import { useState, useEffect, useRef } from "react";
import api from "../api/axios.js";

function useGetPosts({ initialData }) {
  const [posts, setPosts] = useState(initialData ?? []);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsFetchingError, setPostsFetchingError] = useState(null);

  const hasFetchedRef = useRef(false);

  const getPosts = async () => {
    try {
      setPostsLoading(true);
      const res = await api.get("/posts");
      setPosts(res.data.data);
    } catch (err) {
      setPostsFetchingError(`Error in useGetPosts: ${err.message}`);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      return;
    }
    getPosts();
  }, []);

  // expose setPosts to  update posts in Gallery (e.g. after deletion)
  // expos getPosts to refetch without re-render/reloading posts in Gallery

  return { posts, setPosts, postsLoading, postsFetchingError, getPosts };
}

export default useGetPosts;
