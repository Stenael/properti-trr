import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react"
function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setPopup({
          show: true,
          type: "error",
          message: data.message || "Login gagal",
        });

        setTimeout(() => {
          setPopup({
            show: false,
            type: "",
            message: "",
          });
        }, 2000);

        return;
      }

      if (!data.token) {
        setPopup({
          show: true,
          type: "error",
          message: "Token tidak ditemukan",
        });

        setTimeout(() => {
          setPopup({
            show: false,
            type: "",
            message: "",
          });
        }, 2000);

        return;
      }

      localStorage.setItem("token", data.token);
      setPopup({
        show: true,
        type: "success",
        message: "Login berhasil!",
      });

      setTimeout(() => {
        navigate("/dashboardIntern");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setPopup({
        show: true,
        type: "error",
        message: "Terjadi kesalahan pada server",
      });

      setTimeout(() => {
        setPopup({
          show: false,
          type: "",
          message: "",
        });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-blue-500 p-12 text-white">
          <img src="/logo3white.png" alt="Logo" className="w-56 mb-8" />
          <h1 className="text-4xl font-bold mb-4">Selamat Datang</h1>
          <p className="text-center text-white/90 leading-7 max-w-sm">
            Kelola properti Anda dengan lebih mudah. Masuk ke dashboard untuk
            memasang, mengubah, dan memantau iklan properti Anda.
          </p>
        </div>

        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-500 mt-2 mb-8">
              Masuk menggunakan akun Anda.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-500 duration-300 cursor-pointer"
              >
                Login
              </button>
              <p className="text-center text-blue-800">
                Ingin memasarkan properti Anda? Daftarkan diri sekarang dan
                mulai promosikan properti anda.
              </p>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="w-full h-12 rounded-xl border border-blue-800 text-blue-800 font-semibold hover:bg-blue-800 hover:text-white duration-300 cursor-pointer"
              >
                Daftar
              </button>
            </form>
          </div>
        </div>
      </div>
      {popup.show && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`px-6 py-4 rounded-xl shadow-xl text-white font-semibold transition-all duration-300 ${
              popup.type === "success" ? "bg-blue-800" : "bg-red-600"
            }`}
          >
            {popup.message}
          </div>
        </div>
      )}
      {showConfirm && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 sm:p-6">

    <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Peraturan Promosi Properti
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Mohon baca dan pahami ketentuan berikut sebelum melanjutkan.
        </p>
      </div>

      {/* CONTENT */}
      <div className="px-5 sm:px-8 py-5 overflow-y-auto">

        <div className="space-y-4">

          {/* PERATURAN 1 */}
          <div className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Masa Promosi 30 Hari
              </h3>

              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Setiap properti yang dipromosikan akan memiliki masa aktif
                promosi selama <b>30 hari</b> sejak tanggal promosi.
              </p>
            </div>
          </div>

          {/* PERATURAN 2 */}
          <div className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Biaya Promosi
              </h3>

              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Setiap penambahan atau promosi properti akan dikenakan
                <b> biaya promosi</b> sesuai dengan tarif yang berlaku.
              </p>
            </div>
          </div>

          {/* PERATURAN 3 */}
          <div className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Keakuratan Informasi
              </h3>

              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Pengguna wajib memastikan seluruh informasi properti,
                termasuk harga, lokasi, luas, fasilitas, dan foto sesuai
                dengan kondisi sebenarnya.
              </p>
            </div>
          </div>

          {/* PERATURAN 4 */}
          <div className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm">
              4
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Pembaruan Data
              </h3>

              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Apabila terjadi perubahan harga, status, fasilitas, atau
                informasi lainnya, pengguna bertanggung jawab untuk
                memperbarui data properti.
              </p>
            </div>
          </div>

          {/* PERATURAN 5 */}
          <div className="flex gap-3 sm:gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm">
              5
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Properti Terjual / Tersewa
              </h3>

              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Pengguna wajib segera memperbarui status properti apabila
                properti telah <b>terjual atau tersewa</b> agar promosi
                dapat dihentikan.
              </p>
            </div>
          </div>

        </div>

        {/* PERHATIAN */}
        <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-100">
          <p className="text-sm text-red-600 leading-relaxed">
            <b>Perhatian:</b> Dengan melanjutkan, Anda dianggap telah
            membaca dan menyetujui seluruh ketentuan promosi properti.
          </p>
        </div>

      </div>

      {/* FOOTER / BUTTON */}
      <div className="px-5 sm:px-8 py-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg
                       bg-gray-200 hover:bg-gray-300
                       text-gray-700 font-medium
                       cursor-pointer transition"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg
                       bg-blue-800 hover:bg-blue-700
                       text-white font-medium
                       cursor-pointer transition"
          >
            Saya Setuju
          </button>

        </div>
      </div>

    </div>
  </div>
)}
    </div>
  );
}

export default Login;
