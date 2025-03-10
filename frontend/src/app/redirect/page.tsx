"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RedirectPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">Thank you for viewing my Dank Bank!</h1>
      <p>Redirecting in <span className="font-semibold">{countdown}</span> seconds...</p>
    </div>
  );
};

export default RedirectPage;
