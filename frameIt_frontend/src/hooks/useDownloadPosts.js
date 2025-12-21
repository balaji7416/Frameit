import { useState } from "react";
import api from "../api/axios.js";
function useDownloadPosts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadPost = async (imageUrl, filename = "Image") => {
    try {
      setLoading(true);
      const res = await api.get(imageUrl, {
        responseType: "blob",
        withCredentials: false,
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err);
      console.log("Error in useDownloadPosts: ", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, downloadPost };
}

export default useDownloadPosts;
