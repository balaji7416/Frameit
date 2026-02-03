import { useState, useEffect, useRef } from "react";
import api from "../api/axios.js";

function useGetPost(postId, { initialData }) {
  const [postLoading, setPostLoading] = useState(!initialData);
  const [postError, setPostError] = useState(null);
  const [post, setPost] = useState(initialData);

  const hasFetchedRef = useRef(false);

  const getPost = async (id) => {
    try {
      setPostLoading(true);
      const res = await api.get(`/posts/id/${id}`);
      setPost(res.data.data);
    } catch (err) {
      setPostError(err);
      console.log("postError in useGetPost: ", err);
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    if (initialData && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      return;
    }
    getPost(postId);
  }, [postId, initialData]);

  return { postLoading, postError, post, refetch: () => getPost(postId) };
}

export default useGetPost;
