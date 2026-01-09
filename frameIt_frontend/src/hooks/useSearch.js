import { useState } from "react";
import api from "../api/axios";
function useSearch() {
  const [loading, setLoading] = useState(true);

  const searchPosts = async (searchQuery) => {
    try {
      setLoading(true);
      const posts = await api.get(`/posts/search?query=${searchQuery}`);
      return posts.data.data;
    } catch (err) {
      console.log("Error in useSearch: ", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { searchPosts, loading };
}

export default useSearch;
