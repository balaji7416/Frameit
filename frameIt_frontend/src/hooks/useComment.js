import { useEffect, useState } from "react";
import api from "../api/axios.js";

function useComment(postId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const commentPost = async (postId, content) => {
    try {
      setLoading(true);
      await api.post(`/posts/comment/${postId}`, { content });
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getComments = async (postId) => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/comments/${postId}`);
      return res.data.data;
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, commentPost };
}

export default useComment;
