import { useState, useEffect } from "react";
import api from "../api/axios.js";

function useGetPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      setPosts(res.data.data);
    } catch (err) {
      setError("Failed to fetch posts");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  {
    /* exporting setPosts to update posts after deletion in Gallery.jsx */
  }
  return { posts, setPosts, loading, error };
}

export default useGetPosts;
