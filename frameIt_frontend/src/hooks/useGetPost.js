import { useState, useEffect } from "react";
import api from "../api/axios.js";
function useGetPost(postId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  const getPost = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/id/${id}`);
      setPost(res.data.data);
    } catch (err) {
      setError(err);
      console.log("error in useGetPost: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost(postId);
  }, [postId]);

  return { loading, error, post, refetch: () => getPost(postId) };
}

export default useGetPost;
