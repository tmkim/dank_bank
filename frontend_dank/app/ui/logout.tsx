"use client";

import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    alert("Logged out successfully!");
    router.push("/dashboard/items"); // Redirect to login page
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md">
      Logout
    </button>
  );
};

export default LogoutButton;
