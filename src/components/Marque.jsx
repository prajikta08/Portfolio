import React from "react"
import { twMerge } from "tailwind-merge"

export function Marque({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return (
    <div
      {...props}
      className={twMerge(
        "group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={twMerge(
            "flex shrink-0 justify-around [gap:var(--gap)] pointer-events-none", 
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]"
          )}
        >
          {/* CHILDREN MUST HAVE pointer-events-auto */}
          <div className="pointer-events-auto flex">
            {children}
          </div>
        </div>
      ))}
    </div>
  )
}
