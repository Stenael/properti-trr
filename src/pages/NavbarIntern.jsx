import React from "react";
import { useNavigate } from "react-router-dom";

function NavbarIntern() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboardIntern")}
        >
          <h1 className="text-2xl font-bold text-blue-800">
            TRUST234
          </h1>
        </div>

        <div className="flex items-center gap-8 text-gray-700">
          <button
            onClick={() => navigate("/")}
            className="font-medium text-gray-700 hover:text-blue-500 transition cursor-pointer"
          >
            Beranda
          </button>

          <button
            onClick={() => navigate("/dashboardIntern")}
            className="font-medium text-gray-700 hover:text-blue-500 transition cursor-pointer"
          >
            Properti
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="font-medium text-gray-700 hover:text-blue-500 transition cursor-pointer"
          >
            Profil
          </button>

          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:text-red-500 cursor-pointer"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

export default NavbarIntern;