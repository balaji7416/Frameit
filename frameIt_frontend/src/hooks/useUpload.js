import { useState } from "react";
import api from "../api/axios.js";

export default function useUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState("");

  const uploadPost = async ({ title, content, image }) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("content", content);
      formData.append("image", image);
      formData.append("title", title);

      const res = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(res.data.data);
      return res.data.data;
    } catch (err) {
      console.log("Error in useUpload: ", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadPost, loading, error, response };
}
