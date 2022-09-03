import clsx from "clsx";
import { NotificationProps } from "@interfaces";

export default function Notification({
  show,
  children,
  className,
  style,
}: NotificationProps): JSX.Element {
  return (
    <div
      className={clsx(
        "absolute z-20 h-fit w-fit rounded-md bg-emerald-600 p-2 text-sm font-medium text-white transition-[opacity,transform,visibility] duration-700",
        show ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}