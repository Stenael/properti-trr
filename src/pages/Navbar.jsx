import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const res = await fetch("http://localhost:5000/checklogin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      navigate("/dashboardIntern");
    } else {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">

        <div className="flex-1">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer w-fit"
          >
            <img src="/logo3.png" alt="Logo" className="w-30" />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center gap-10 flex-1">
          <button
            onClick={() => navigate("/")}
            className="font-medium text-gray-700 hover:text-blue-500 transition cursor-pointer"
          >
            Beranda
          </button>

          <button
            onClick={() => navigate("/sale")}
            className="font-medium text-gray-700 hover:text-blue-500 transition cursor-pointer"
          >
            Jual
          </button>

          <button
            onClick={() => navigate("/rent")}
            className="font-medium text-gray-700 hover:text-blue-500 transition cursor-pointer"
          >
            Sewa
          </button>
        </div>

        <div className="hidden md:flex flex-1 justify-end">
          <button
            onClick={handleDashboard}
            className="text-blue-800 font-semibold hover:text-blue-500 transition cursor-pointer"
          >
            Masuk Dashboard
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
        <div className="md:hidden bg-white shadow-md">
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
              navigate("/sale");
              setOpen(false);
            }}
            className="w-full text-left px-6 py-4 hover:bg-gray-100"
          >
            Dijual
          </button>

          <button
            onClick={() => {
              navigate("/rent");
              setOpen(false);
            }}
            className="w-full text-left px-6 py-4 hover:bg-gray-100"
          >
            Disewa
          </button>

          <button
            onClick={() => {
              handleDashboard();
              setOpen(false);
            }}
            className="w-full text-left px-6 py-4 text-blue-700 font-semibold hover:bg-gray-100"
          >
            Masuk Dashboard
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;