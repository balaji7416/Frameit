import api from "../api/axios.js";

const registerUser = async (username, email, password, rememberMe) => {
  try {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
      rememberMe,
    });

    return res.data.data;
  } catch (err) {
    console.log("register Error: ", err);
    throw err;
  }
};

const loginUser = async (email, password, rememberMe) => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
      rememberMe,
    });
    return res.data.data;
  } catch (err) {
    console.log("login Error: ", err);
    throw err;
  }
};

// not in use since local storage is used instead of cookies
// const logOutUser = async () => {
//   try {
//     const res = await api.post("/auth/logout");
//     return res.data.data;
//   } catch (err) {
//     console.log("logout Error: ", err);
//     throw err;
//   }
// };

const checkAuth = async () => {
  try {
    const user = localStorage.getItem("user") ?? sessionStorage.getItem("user");
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");
    console.log(token);
    if (!token) {
      throw new Error("Not authenticated");
    }

    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.log("Auth check Error: ", err);
    throw err;
  }
};

export { registerUser, loginUser, checkAuth };
