import api from "../api/axios.js";

function useToggleLike() {
  const toggleLikePost = async (id) => {
    const res = await api.post(`/posts/toggle-like/${id}`);
    return res.data.data;
  };

  return { toggleLikePost };
}

export default useToggleLike;
