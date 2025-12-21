import { useState } from "react";
import ToastContext from "./ToastContext.js";
import ToastContainer from "./ToastContainer.jsx";

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export default ToastProvider;
