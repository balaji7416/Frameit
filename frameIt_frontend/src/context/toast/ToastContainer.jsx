import clsx from "clsx";
import useToast from "./useToast.js";
function ToastContainer() {
  const { toasts } = useToast();
  return (
    <div className="fixed top-12 right-5 mt-3 flex flex-col flex-col-reverseh-auto gap-4 z-50  pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "px-4 py-3 rounded-md shadow-md",
            "animate-fade pointer-events-auto",
            toast.type === "error" ? "bg-red-500 text-white" : "",
            toast.type === "success" ? "bg-green-500 text-white" : "",
            toast.type === "info" ? "bg-blue-500 text-white" : ""
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
