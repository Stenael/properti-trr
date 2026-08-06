import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [name, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");  
  const [showNotif, setShowNotif] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://192.168.101.37:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          name,
          city,
          phone_number,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        setShowNotif(true);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-blue-500 p-12 text-white">
            <img src="/logo3white.png" alt="Logo" className="w-56 mb-8" />
            <h1 className="text-4xl font-bold mb-4 text-center">
            Bergabung Bersama Kami
            </h1>
            <p className="text-center text-white/90 leading-7 max-w-sm">
            Daftarkan akun Anda untuk mulai memasang, mengelola,
            dan mempromosikan properti kepada ribuan calon pembeli
            maupun penyewa.
            </p>
        </div>

        <div className="flex items-center justify-center p-10">
            <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800">
                Daftar
            </h2>
            <p className="text-gray-500 mt-2 mb-3">
                Buat akun baru untuk mulai beriklan.
            </p>
            {error && (
                <div className="mb-3 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Masukkan username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                    </label>
                    <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota
                    </label>
                    <input
                    type="text"
                    placeholder="Masukkan kota"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon
                    </label>
                    <input
                        type="number"
                        placeholder="08xxxxxxxxxx"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="email@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-600 duration-300 cursor-pointer"
                >
                    Daftar
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full h-12 rounded-xl border border-blue-800 text-blue-800 font-semibold hover:bg-blue-800 hover:text-white duration-300 cursor-pointer"
                >
                    Sudah punya akun? Login
                </button>
                </form>
            </div>
        </div>
        </div>
        {showNotif && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center">
                <h2 className="text-2xl font-bold text-gray-800 mt-5">
                    Registrasi Berhasil
                </h2>
                <p className="text-gray-500 mt-2">
                    Akun berhasil dibuat. Silakan login untuk melanjutkan.
                </p>
                <button
                    onClick={() => {
                    setShowNotif(false);
                    navigate("/login");
                    }}
                    className="mt-6 w-full h-11 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                    Login Sekarang
                </button>
                </div>
            </div>
            )}
    </div>
  );
}

export default Register;
