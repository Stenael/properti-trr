import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarIntern from "./NavbarIntern";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Save,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import Footer from "./Footer";

function Profile() {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showNotifPassword, setShowNotifPassword] = useState(false);

  const [edit, setEdit] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone_number: "",
    email: "",
    city: "",
    exclusive: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://192.168.101.37:5000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://192.168.101.37:5000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setShowNotif(true);
      setEdit(false);
    } else {
      alert(data.message);
    }
  };

  const checkOldPassword = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://192.168.101.37:5000/profile/check-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: oldPassword,
        }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      setShowOldPassword(false);
      setShowNewPassword(true);
      setOldPassword("");
    } else {
      alert(data.message);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Konfirmasi password tidak sama.");
    }

    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://192.168.101.37:5000/profile/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      setShowNotifPassword(true);
      setShowNewPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <NavbarIntern />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-800 hover:text-blue-600 font-medium mb-6 transition cursor-pointer"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <div className="max-full">
            <div className="bg-white rounded-2xl shadow-lg pb-10 overflow-hidden">
              <div className="bg-blue-900 h-40" />

              <div className="px-10 p-3">
                <div className="-mt-14 w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                  <User size={55} />
                </div>

                <div className="md:flex justify-between items-center mt-6">
                  <div>
                    <h1 className="text-3xl font-bold">{formData.name}</h1>
                    <p className="text-gray-500">@{formData.username}</p>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setShowOldPassword(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 h-11 md:w-60 w-30 md:text-lg text-xs rounded-xl cursor-pointer"
                    >
                      Ubah Password
                    </button>

                    {!edit ? (
                      <button
                        onClick={() => setEdit(true)}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-5 h-11 rounded-xl flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil size={18} />
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 h-11 rounded-xl flex items-center gap-2 cursor-pointer"
                      >
                        <Save size={18} />
                        Simpan
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-10">
                  <div>
                    <label className="font-semibold">Nama</label>
                    <div className="relative mt-2">
                      <User
                        className="absolute left-4 top-4 text-gray-400"
                        size={18}
                      />
                      <input
                        name="name"
                        disabled={!edit}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-12 border border-blue-800 rounded-xl pl-12 px-4 disabled:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold">Kota</label>
                    <div className="relative mt-2">
                      <MapPin
                        className="absolute left-4 top-4 text-gray-400"
                        size={18}
                      />
                      <input
                        name="city"
                        disabled={!edit}
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full h-12 border border-blue-800 rounded-xl pl-12 px-4 disabled:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold">Nomor HP</label>
                    <div className="relative mt-2">
                      <Phone
                        className="absolute left-4 top-4 text-gray-400"
                        size={18}
                      />
                      <input
                        name="phone_number"
                        disabled={!edit}
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full h-12 border border-blue-800 rounded-xl pl-12 px-4 disabled:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold">Email</label>
                    <div className="relative mt-2">
                      <Mail
                        className="absolute left-4 top-4 text-gray-400"
                        size={18}
                      />
                      <input
                        name="email"
                        disabled={!edit}
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 border border-blue-800 rounded-xl pl-12 px-4 disabled:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {showOldPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-2xl w-[300px] md:w-[420px] p-7">
            <h2 className="text-2xl font-bold">Verifikasi Password</h2>

            <p className="text-gray-500 mt-2">Masukkan password lama Anda.</p>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full h-12 border rounded-xl px-4 mt-6"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowOldPassword(false);
                  setOldPassword("");
                }}
                className="px-5 h-11 bg-gray-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={checkOldPassword}
                className="px-5 h-11 bg-blue-700 text-white rounded-xl cursor-pointer"
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
      {showNewPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-2xl w-[420px] p-7">
            <h2 className="text-2xl font-bold">Password Baru</h2>
            <input
              type="password"
              placeholder="Password Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 border rounded-xl px-4 mt-6"
            />
            <input
              type="password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 border rounded-xl px-4 mt-4"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewPassword(false)}
                className="px-5 h-11 bg-gray-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={changePassword}
                className="px-5 h-11 bg-blue-800 text-white rounded-xl cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showNotifPassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Bookmark className="text-blue-800" size={34} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-5">
              Ubah Password Telah Berhasil
            </h2>
            <button
              onClick={() => setShowNotifPassword(false)}
              className="mt-6 w-full h-11 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showNotif && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Bookmark className="text-blue-800" size={34} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-5">
              Ubah Data Telah Berhasil
            </h2>
            <button
              onClick={() => setShowNotif(false)}
              className="mt-6 w-full h-11 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
