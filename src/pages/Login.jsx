import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      if (!data.token) {
        alert("Token not found in response");
        return;
      }

      localStorage.setItem('token', data.token);
      alert('Login successful!');

      navigate('/dashboardIntern');
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-blue-500 p-12 text-white">
            <h1 className='text-2xl font-semibold mb-5'>TRUST234</h1>
            <h1 className="text-4xl font-bold mb-4">
            Selamat Datang
            </h1>
            <p className="text-center text-white/90 leading-7 max-w-sm">
            Kelola properti Anda dengan lebih mudah.
            Masuk ke dashboard untuk memasang, mengubah,
            dan memantau iklan properti Anda.
            </p>
        </div>

        <div className="flex items-center justify-center p-10">
            <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800">
                Login
            </h2>
            <p className="text-gray-500 mt-2 mb-8">
                Masuk menggunakan akun Anda.
            </p>
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
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
                className="w-full h-12 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-500 duration-300"
                >
                Login
                </button>
                <p className="text-center text-blue-800">
                  Ingin memasarkan properti Anda? Daftarkan diri sekarang dan mulai promosikan properti anda.
                </p>
                <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full h-12 rounded-xl border border-blue-800 text-blue-800 font-semibold hover:bg-blue-800 hover:text-white duration-300"
                >
                Daftar
                </button>
            </form>
            </div>
        </div>
        </div>
    </div>
    );
}

export default Login;
