import clsx from "clsx";
export default function Spinner({ type = "sm" }) {
  return (
    <div
      className={clsx(
        " border-blue-600 rounded-full border-t-transparent",
        "animate-spin",
        type === "sm" && "w-5 h-5 border-2",
        type === "md" && "w-10 h-10 border-4",
        type === "lg" && "w-16 h-16 border-8"
      )}
    ></div>
  );
}
