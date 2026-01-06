// app/components/ui/Button.tsx
"use client";

import clsx from "clsx";

type ButtonProps = {
  text: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  text,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-6 py-3 rounded-md font-semibold transition",
        {
          "bg-orange-400 text-white hover:bg-white/20":
            variant === "primary",

          "bg-white text-orange-400 backdrop-blur-md hover:bg-white/20":
            variant === "secondary",
        },
        className
      )}
    >
      {text}
    </button>
  );
}
