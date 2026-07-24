import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-blue-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <div className="flex items-center gap-3 mb-5">
              <h1 className="text-2xl font-bold text-white">
                TRUST234
              </h1>
            </div>

            <p className="text-blue-100 leading-7">
              Platform pencarian rumah, apartemen,
              ruko, dan properti terpercaya untuk
              jual maupun sewa di Surabaya.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-5">
              Menu
            </h2>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/")}
                className="text-left hover:text-blue-300 transition cursor-pointer"
              >
                Beranda
              </button>

              <button
                onClick={() => navigate("/sale")}
                className="text-left hover:text-blue-300 transition cursor-pointer"
              >
                Properti Dijual
              </button>

              <button
                onClick={() => navigate("/rent")}
                className="text-left hover:text-blue-300 transition cursor-pointer"
              >
                Properti Disewa
              </button>

              <button
                onClick={() => navigate("/question")}
                className="text-left hover:text-blue-300 transition cursor-pointer"
              >
                FAQ
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-5">
              Kontak
            </h2>

            <div className="space-y-4 text-blue-100">

              <div className="flex gap-3">
                <MapPin size={20} />
                <span>Surabaya, Indonesia</span>
              </div>

              <div className="flex gap-3">
                <Phone size={20} />
                <span>+62 81111111111111</span>
              </div>

              <div className="flex gap-3">
                <Mail size={20} />
                <span>info@ininama  .com</span>
              </div>

            </div>
          </div>
        </div>
        <div className="border-t border-blue-700 mt-12 pt-6 text-center text-blue-200 text-sm">
          © {new Date().getFullYear()} Ini Nama. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;