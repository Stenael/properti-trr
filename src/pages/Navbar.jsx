import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    const res = await fetch("http://localhost:5000/checklogin", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    if(res.ok){
        navigate("/dashboardIntern");
    }else{
        localStorage.removeItem("token");
        navigate("/login");
    }
  };

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <h1 className="text-2xl font-bold text-blue-800">
            TRUST234
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-10">
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
            Dijual
          </button>

          <button
            onClick={() => navigate("/rent")}
            className="font-medium text-gray-700 hover:text-blue-500 transition cursor-pointer"
          >
            Disewa
          </button>

          <button
            onClick={() => navigate("/question")}
            className="font-medium text-gray-700 hover:text-blue-500 transition cursor-pointer"
          >
            FAQ
          </button>
        </div>

        <button
          onClick={handleDashboard}
          className="text-blue-800 font-semibold hover:underline hover:text-blue-500 transition duration-200 cursor-pointer"
        >
          Masuk Dashboard
        </button>
      </div>
    </nav>
  );
}

export default Navbar;  