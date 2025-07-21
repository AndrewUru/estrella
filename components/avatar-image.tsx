"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

export function AvatarImage({ className = "", ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 animate-pulse">
          <svg className="w-6 h-6 text-zinc-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}
      <Image
        {...props}
        className={`object-cover transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
}
