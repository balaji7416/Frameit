import clsx from "clsx";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import useAuth from "../context/auth/useAuth.js";
import Spinner from "../components/Spinner.jsx";
import { ArrowLeftIcon, Check } from "lucide-react";
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [formMessage, setFormMessage] = useState(null);
  const [searchParams] = useSearchParams();
  const [reg, setReg] = useState(() => {
    return searchParams.get("reg") === "true";
  });

  const navigate = useNavigate();

  const { register, login, loading } = useAuth();
  const [rememberMe, setRememberME] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (reg) {
        res = await register(username, email, password, rememberMe);
      } else {
        res = await login(email, password, rememberMe);
      }

      setFormMessage(res?.message || "action success");
      navigate("/home", { replace: true });
    } catch (err) {
      setFormMessage(
        err.response?.data?.message ||
          (reg ? "Registration Failed" : "Login Failed")
      );
    }
  };

  const toggleMode = () => {
    setReg((r) => !r);
    setUsername("");
    setEmail("");
    setPassword("");
    setFormMessage("");
  };

  return (
    // container
    <div
      className={clsx(
        "h-screen w-full flex items-center justify-center p-5 md:p-10"
      )}
    >
      <button
        className={clsx(
          "absolute top-1/4 left-5 md:top-1/4 md:left-1/4",
          "bg-gray-100 px-2 py-1 sm::px-5 sm:py-2 rounded-md shadow-md",
          "font-bold"
        )}
        onClick={() => navigate("/", { replace: true })}
      >
        <ArrowLeftIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 w-10" />
      </button>
      {/* main login form */}
      <div
        className={clsx(
          "flex flex-col justify-evenly items-center gap-3",
          "rounded-md shadow-md p-3 sm:p-5 md:p-7",
          "w-full sm:max-w-130 md:max-w-140",
          "bg-gray-50"
        )}
      >
        <h1
          className={clsx(
            "text-lg sm:text-xl font-bold tracking-wider",
            "mb-2 sm:mb-3"
          )}
        >
          {reg ? "SignUp" : "Login"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className={clsx(
            "flex flex-col items-center justify-evenly gap-3",
            "w-full"
          )}
        >
          {reg && (
            <input
              type="text"
              value={username}
              placeholder="username"
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              className={clsx(
                "px-5 py-2 w-full rounded-md border-2 border-gray-200",
                "bg-white text-sm sm:text-base text-gray-850",
                "focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "transition-all duration-150 ease-out"
              )}
            />
          )}
          {
            <input
              type="text"
              value={email}
              placeholder="email"
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className={clsx(
                "px-5 py-2 w-full rounded-md border-2 border-gray-200",
                "bg-white text-sm sm:text-base text-gray-850",
                "focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "transition-all duration-150 ease-out"
              )}
            />
          }
          <input
            type="password"
            value={password}
            placeholder="password"
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className={clsx(
              "px-5 py-2 w-full rounded-md border-2 border-gray-200",
              "bg-white text-sm sm:text-base text-gray-850",
              "focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "transition-all duration-150 ease-out"
            )}
          />

          {/* remember me */}
          <label
            htmlFor="rememberMe"
            className={clsx(
              "flex items-center justify-center gap-3",
              "cursor-pointer w-full"
            )}
          >
            <input
              type="checkbox"
              disabled={loading}
              id="rememberMe"
              value={rememberMe}
              onChange={(e) => setRememberME(e.target.checked)}
            />
            <span
              className={clsx(
                "font-semibold text-sm sm:text-base text-gray-500"
              )}
            >
              Remember me
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              "w-3/4 px-5 py-2 rounded-md",
              "bg-blue-600 text-sm sm:text-base text-white font-semibold",
              "focus:bg-blue-500 active:scale-[.98]",
              "transition-all duration-150 ease-out"
            )}
          >
            {reg ? "Register" : "Login"}
          </button>
        </form>
        <div
          className={clsx(
            "p-2 sm:p-3 md:p-4 text-sm sm:text-base",
            loading ? "text-green-500" : "text-red-500",
            "font-semibold"
          )}
        >
          {loading ? <Spinner type="sm" /> : formMessage}
        </div>
        <p
          className={clsx(
            "p-2 sm:p-3 md:p-4 text-sm sm:text-base",
            "font-semibold"
          )}
        >
          {!reg ? "Don't have an account? " : "Already have an account? "}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 font-bold focus:text-blue-500 active:text-blue-700"
          >
            {!reg ? "SignUp" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
