import { useCallback, useState } from "react";
import React from "react";

type AsyncFn<T> = () => Promise<T>;

export default function useLoader() {
  const [loading, setLoading] = useState(false);

  const start = useCallback(() => setLoading(true), []);
  const stop = useCallback(() => setLoading(false), []);

  const withLoader = useCallback(
    async <T,>(task: Promise<T> | AsyncFn<T>): Promise<T> => {
      start();
      try {
        const result =
          typeof task === "function" ? await (task as AsyncFn<T>)() : await task;
        return result;
      } finally {
        stop();
      }
    },
    [start, stop]
  );

  const LoadingComponent = useCallback(
    ({
      children,
      message = "Loading",
      className = "fixed inset-0 z-50",
    }: {
      children?: React.ReactNode;
      message?: string;
      className?: string;
    }) => {
      if (!loading) return <>{children}</>;

      return (
        <div className={`flex items-center justify-center bg-white/80 ${className}`}>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#6B7280] text-sm">{message}</p>
          </div>
        </div>
      );
    },
    [loading]
  );

  return { loading, start, stop, withLoader, LoadingComponent };
}
