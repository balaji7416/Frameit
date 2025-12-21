import { useContext } from "react";
import ToastContext from "./ToastContext.js";

function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("Context not found");
  }
  return context;
}

export default useToast;
