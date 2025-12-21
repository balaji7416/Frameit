import { useState } from "react";
import api from "../api/axios.js";
function useDeletePost() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deletePost = async (postId) => {
    try {
      setLoading(true);
      await api.delete(`/posts/${postId}`);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, deletePost };
}

export default useDeletePost;
