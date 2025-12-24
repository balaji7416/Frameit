import { useState } from "react";
import api from "../api/axios";
function useSearch() {
  const [loadinng, setLoading] = useState(false);

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

  return { searchPosts, loadinng };
}

export default useSearch;
