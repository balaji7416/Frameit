import { useState } from "react";
import api from "../api/axios.js";

function useUserPosts(username) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const getUserPosts = async () => {
    if (!username) {
      throw Error("User not found: from useUserPosts hook");
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`posts/user/${username}`);
      setUserPosts(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err);
      console.log("Error in useUserGetPosts: ", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  {
    /* exporting setPosts to update posts after deletion in Gallery.jsx */
  }
  return { loading, error, userPosts, getUserPosts, setUserPosts };
}

export default useUserPosts;
