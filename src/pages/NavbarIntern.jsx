import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function NavbarIntern() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://192.168.101.37:5000/logout", {
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
    <nav className="w-full bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        <div
          className="cursor-pointer flex-1"
          onClick={() => navigate("/dashboardIntern")}
        >
          <img src="/logo3.png" alt="Logo" className="w-30" />
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          <button
            onClick={() => navigate("/")}
            className="font-medium hover:text-blue-500 transition cursor-pointer"
          >
            Beranda
          </button>

          <button
            onClick={() => navigate("/dashboardIntern")}
            className="font-medium hover:text-blue-500 transition cursor-pointer"
          >
            Properti
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="font-medium hover:text-blue-500 transition cursor-pointer"
          >
            Profil
          </button>

        </div>

        <div className="hidden md:flex flex-1 justify-end">
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:text-red-500 cursor-pointer"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden ml-auto text-blue-800"
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <button
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
            className="w-full text-left px-6 py-4 hover:bg-gray-100"
          >
            Beranda
          </button>

          <button
            onClick={() => {
              navigate("/dashboardIntern");
              setOpen(false);
            }}
            className="w-full text-left px-6 py-4 hover:bg-gray-100"
          >
            Properti
          </button>

          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="w-full text-left px-6 py-4 hover:bg-gray-100"
          >
            Profil
          </button>

          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="w-full text-left px-6 py-4 text-red-600 font-semibold hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavbarIntern;