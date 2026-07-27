import React, { useEffect, useState } from "react";
import {
  Plus,
  MapPin,
  Bed,
  Bath,
  Square,
  Zap,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarIntern from "./NavbarIntern";
import Footer from "./Footer";

function DashboardIntern() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/properties", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 403 || res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return null;
        }

        return res.json();
      })
      .then((data) => {
        if (data) setProperties(data);
      });
  }, []);

  const filteredProperties = properties.filter((item) => {
    if (statusFilter === "all") return true;

    if (statusFilter === "active") return item.status === 0;

    if (statusFilter === "inactive") return item.status === 1;
  });

  const handleReactivate = async (id) => {
    const token = localStorage.getItem("token");

    const confirm = window.confirm(
      "Aktifkan kembali promosi ini selama 30 hari?"
    );

    if (!confirm) return;

    const res = await fetch(
      `http://localhost:5000/properties/${id}/reactivate`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      setProperties((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 0,
                created_at: new Date().toISOString(),
              }
            : item
        )
      );
    }
  };

  return (
    <>
      <NavbarIntern />
      <div className="bg-white max-h-full ">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">
                Properti Saya
              </h1>
              <p className="text-gray-500 mt-2">
                Kelola seluruh promosi properti Anda.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 h-11 rounded-xl cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-blue-800 text-white"
                    : "bg-blue-200"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 h-11 rounded-xl cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-green-600 text-white"
                    : "bg-blue-200"
                }`}
              >
                Aktif
              </button>
              <button
                onClick={() => setStatusFilter("inactive")}
                className={`px-4 h-11 rounded-xl cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-red-600 text-white"
                    : "bg-red-200"
                }`}
              >
                Tidak Aktif
              </button>
              <button
                onClick={() => navigate("/promotion")}
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 h-12 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Plus size={18} />
                Tambah Properti
              </button>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-20 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">
                Belum ada properti
              </h2>

              <p className="text-gray-500 mt-2">
                Tambahkan properti pertama Anda.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {filteredProperties.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl duration-300 overflow-hidden"
                >
                  <img
                    src={`http://localhost:5000/uploads/${item.images[0]}`}
                    className="w-full h-60 object-cover"
                    alt=""
                  />

                  <div className="p-6">

                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold">
                        {item.name}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                          item.type === "Dijual"
                            ? "bg-green-600"
                            : "bg-orange-500"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 mt-3 text-xs">
                      <MapPin size={16} />
                      {item.district}, {item.village}
                    </div>

                    <div className="text-2xl font-bold text-green-600 mt-4">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 text-sm">

                      <div className="flex items-center gap-2">
                        <div className="font-semibold">LB</div>
                        {item.luasBangunan} m²
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="font-semibold">LT</div>
                        {item.luasTanah} m²
                      </div>

                      <div className="flex items-center gap-2">
                        <Bed size={16} />
                        {item.kt} KT
                      </div>

                      <div className="flex items-center gap-2">
                        <Bath size={16} />
                        {item.km} KM
                      </div>

                      <div className="flex items-center gap-2 col-span-2">
                        <Zap size={16} />
                        {item.listrik} Watt
                      </div>

                    </div>

                    <div className="flex gap-3 mt-8 ">
                      <button
                        onClick={() => navigate(`/edit/${item.id}`)}
                        className="flex-1 h-11 rounded-xl bg-blue-800 text-white hover:bg-blue-900 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Pencil size={17} />
                        Edit
                      </button>

                      {item.status === 1 && (
                        <button
                          onClick={() => handleReactivate(item.id)}
                          className="h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white px-3 cursor-pointer"
                        >
                          Aktifkan Kembali
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default DashboardIntern;