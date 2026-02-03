import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import UserPostsPage from "./pages/UserPostsPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import PostViewPage from "./pages/PostViewPage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import { User } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop.jsx";
export default function App() {
  return (
    <div>
      <Navbar />

      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/auth" element={<LoginPage />}></Route>
        <Route element={<MainLayout />}>
          <Route
            index
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePostPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/posts/:username"
            element={
              <PrivateRoute>
                <UserPostsPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/post/:postId"
            element={
              <PrivateRoute>
                <PostViewPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchResultsPage />
              </PrivateRoute>
            }
          ></Route>
        </Route>
      </Routes>
    </div>
  );
}
