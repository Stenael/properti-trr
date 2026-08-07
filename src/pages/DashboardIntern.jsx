import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  MapPin,
  Bed,
  Bath,
  Zap,
  Pencil,
  FileText,
  BanknoteCheck,
  Search,
  Home,
  KeyRound,
  CircleCheckBig,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarIntern from "./NavbarIntern";
import Footer from "./Footer";

function DashboardIntern() {
  const navigate = useNavigate();
  const propertySectionRef = useRef(null);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;

  const scrollToProperties = () => {
    propertySectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    fetchProperties();
    const pending = JSON.parse(localStorage.getItem("pendingPayment"));

    if (!pending) return;

    startCheckingPayment(pending.partner_ref_no);
  }, []);

  const fetchProperties = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://192.168.101.37:5000/properties", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const data = await res.json();

    setProperties(data);

    if (data.length > 0) {
      setExclusive(data[0].exclusive);
    }
  };

  const filteredProperties = properties.filter((item) => {
    let matchStatus = true;

    if (statusFilter === "all") {
      matchStatus = item.soldStatus === 0;
    } else if (statusFilter === "active") {
      matchStatus = item.status === 0 && item.soldStatus === 0;
    } else if (statusFilter === "inactive") {
      matchStatus = item.status === 1 && item.soldStatus === 0;
    } else if (statusFilter === "sold") {
      matchStatus = item.soldStatus === 1;
    }

    let matchType = true;

    if (typeFilter === "jual") {
      matchType = item.type === "Dijual";
    } else if (typeFilter === "sewa") {
      matchType = item.type === "Disewa";
    } else if (typeFilter === "sold") {
      matchType = item.soldStatus === 1;
    }

    const search = keyword.toLowerCase();

    const matchKeyword =
      item.name.toLowerCase().includes(search) ||
      item.district.toLowerCase().includes(search) ||
      item.village.toLowerCase().includes(search) ||
      item.address.toLowerCase().includes(search);

    return matchStatus && matchType && matchKeyword;
  });

  const handleReactivate = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://192.168.101.37:5000/properties/${id}/reactivate`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    if (res.ok) {
      setProperties((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 0,
                created_at: new Date().toISOString(),
              }
            : item,
        ),
      );
      setShowNotifActive(true);
    }
  };

  const handleSold = async () => {
    if (!selectedProperty) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://192.168.101.37:5000/properties/${selectedProperty.id}/sold`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (res.ok) {
      setProperties((prev) =>
        prev.map((item) =>
          item.id === selectedProperty.id
            ? {
                ...item,
                soldStatus: 1,
              }
            : item,
        ),
      );

      setShowConfirm(false);
      setSelectedProperty(null);

      setNotifMessage(data.message);
      setShowNotif(true);

      setTimeout(() => {
        setShowNotif(false);
      }, 2000);
    } else {
      setShowConfirm(false);

      setNotifMessage(data.message);
      setShowNotif(true);
    }
  };

  const [exclusive, setExclusive] = useState(0);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty,
  );

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNotifActive, setShowNotifActive] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);

  const [showDeleteNotif, setShowDeleteNotif] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const [selectedReactivate, setSelectedReactivate] = useState(null);
  const [showConfirmActive, setShowConfirmActive] = useState(false);
  const [showQris, setShowQris] = useState(false);
  const [qrisData, setQrisData] = useState(null);
  const [loadingQris, setLoadingQris] = useState(false);

  const handleGenerateQRIS = async () => {
    try {
      setLoadingQris(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://192.168.101.37:5000/payment/generate-qris",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 2500,
            propertyId: selectedReactivate.id,
          }),
        },
      );

      const data = await res.json();
      // console.log("Generate QRIS:", data);
      // console.log("HTTP:", res.status);
      setLoadingQris(false);

      if (!res.ok) {
        alert(data.message);
        return;
      }
      localStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          partner_ref_no: data.partner_ref_no,
          propertyId: selectedReactivate.id,
        }),
      );
      setQrisData(data);
      setShowConfirmActive(false);
      setShowQris(true);
      // console.log("Memulai polling");
      startCheckingPayment(data.partner_ref_no);
    } catch (err) {
      console.log(err);
      setLoadingQris(false);
      alert("Server Error");
    }
  };

  const startCheckingPayment = (partner_ref_no) => {
    // console.log("startCheckingPayment dipanggil");
    console.log(partner_ref_no);

    const token = localStorage.getItem("token");
    const interval = setInterval(async () => {
      const res = await fetch(
        `http://192.168.101.37:5000/payment/query/${partner_ref_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      // console.log(data);
      // console.log(data.responseData.qrisStatus);
      if (data.responseData?.qrisStatus === "PAID") {
        clearInterval(interval);
        localStorage.removeItem("pendingPayment");
        // console.log("Pembayaran berhasil");
        setShowQris(false);
        setShowNotifActive(true);
        await fetchProperties();
      }
    }, 3000);
  };

  const totalJual = properties.filter(
    (item) => item.type === "Dijual" && item.soldStatus === 0,
  ).length;

  const totalSewa = properties.filter(
    (item) => item.type === "Disewa" && item.soldStatus === 0,
  ).length;

  const totalLaku = properties.filter((item) => item.soldStatus === 1).length;

  const handleDelete = async () => {
    if (!selectedDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://192.168.101.37:5000/properties/${selectedDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        setProperties((prev) =>
          prev.filter((item) => item.id !== selectedDelete.id),
        );

        setShowDeleteConfirm(false);
        setSelectedDelete(null);

        setDeleteMessage(data.message);
        setShowDeleteNotif(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <NavbarIntern />
      <div className="bg-white max-h-full ">
        <div className="relative bg-white text-blue-800 px-5 sm:px-8 md:px-16 lg:px-32 py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Properti Saya</h1>
          <p className="text-gray-800 mt-2">
            Kelola seluruh promosi properti Anda dengan mudah.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            <div
              onClick={() => {
                setTypeFilter("jual");
                setStatusFilter("all");
                setCurrentPage(1);
                setTimeout(scrollToProperties, 100);
              }}
              className={`bg-white rounded-2xl px-6 py-3 flex items-center gap-5 shadow-lg cursor-pointer transition hover:shadow-xl ${
                typeFilter === "jual" ? "ring-2 ring-green-500" : ""
              }`}
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-green-500 flex items-center justify-center">
                <Home size={30} className="text-white md:w-9 md:h-9" />
              </div>
              <div>
                <div className="text-gray-500 font-medium text-sm">Dijual</div>
                <div className="text-4xl font-bold text-green-600">
                  {totalJual}
                </div>
                <div className="text-gray-500 text-sm">Properti</div>
              </div>
            </div>

            <div
              onClick={() => {
                setTypeFilter("sewa");
                setStatusFilter("all");
                setCurrentPage(1);
                setTimeout(scrollToProperties, 100);
              }}
              className={`bg-white rounded-2xl px-6 py-3 flex items-center gap-5 shadow-lg cursor-pointer transition hover:shadow-xl ${
                typeFilter === "sewa" ? "ring-2 ring-orange-500" : ""
              }`}
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-orange-500 flex items-center justify-center">
                <KeyRound className="text-white md:w-9 md:h-9" size={30} />
              </div>
              <div>
                <div className="text-gray-500 font-medium text-sm">
                  Disewakan
                </div>
                <div className="text-4xl font-bold text-orange-500">
                  {totalSewa}
                </div>
                <div className="text-gray-500 text-sm">Properti</div>
              </div>
            </div>

            <div
              onClick={() => {
                setTypeFilter("sold");
                setStatusFilter("sold");
                setCurrentPage(1);
                setTimeout(scrollToProperties, 100);
              }}
              className={`bg-white rounded-2xl px-6 py-3 flex items-center gap-5 shadow-lg cursor-pointer transition hover:shadow-xl ${
                typeFilter === "sold" ? "ring-2 ring-blue-700" : ""
              }`}
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-blue-800 flex items-center justify-center">
                <CircleCheckBig
                  className="text-white md:w-9 md:h-9"
                  size={30}
                />
              </div>
              <div>
                <div className="text-gray-500 font-medium text-sm">
                  Sudah Laku
                </div>
                <div className="text-4xl font-bold text-blue-800">
                  {totalLaku}
                </div>
                <div className="text-gray-500 text-sm">Properti</div>
              </div>
            </div>
          </div>
        </div>
        <div ref={propertySectionRef} className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className={`px-5 h-11 rounded-xl font-medium transition cursor-pointer ${
                      statusFilter === "all"
                        ? "bg-blue-800 text-white"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    Semua
                  </button>
                  {exclusive === 0 && (
                    <>
                      <button
                        onClick={() => {
                          setStatusFilter("active");
                          setCurrentPage(1);
                        }}
                        className={`px-5 h-11 rounded-xl font-medium transition cursor-pointer ${
                          statusFilter === "active"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        Aktif
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("inactive");
                          setCurrentPage(1);
                        }}
                        className={`px-5 h-11 rounded-xl font-medium transition cursor-pointer ${
                          statusFilter === "inactive"
                            ? "bg-red-600 text-white"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        Tidak Aktif
                      </button>
                    </>
                  )}
                </div>
                <div className="relative flex-1 max-w-xl">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Cari rumah, ruko, atau tanah..."
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-11 pl-12 pr-4 rounded-xl border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/promotion")}
                className="bg-blue-800 hover:bg-blue-900 text-white px-6 h-12 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Plus size={18} />
                Tambah Properti
              </button>
            </div>
          </div>

          {filteredProperties.length === 0 ? (
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
              {currentProperties.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl duration-300 overflow-hidden"
                >
                  <img
                    onClick={() => navigate(`/property/${item.id}`)}
                    src={`http://192.168.101.37:5000/uploads/${item.images[0]}`}
                    className="w-full h-60 object-cover cursor-pointer"
                    alt=""
                  />

                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2
                        onClick={() => navigate(`/property/${item.id}`)}
                        className="text-lg font-bold cursor-pointer"
                      >
                        {item.name}
                      </h2>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm text-white ${
                            item.type === "Dijual"
                              ? "bg-green-600"
                              : "bg-orange-500"
                          }`}
                        >
                          {item.type}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedDelete(item);
                            setShowDeleteConfirm(true);
                          }}
                          className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

                      <div className="flex items-center gap-2">
                        <Zap size={16} />
                        {item.listrik} Watt
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        {item.sertifikat}
                      </div>
                    </div>
                    {item.soldStatus === 0 ? (
                      <div className="flex flex-col gap-3 mt-8 ">
                        <button
                          onClick={() => navigate(`/edit/${item.id}`)}
                          className="h-11 rounded-xl bg-blue-800 text-white hover:bg-blue-900 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Pencil size={17} />
                          Edit
                        </button>

                        {item.soldStatus === 0 && (
                          <button
                            onClick={() => {
                              setSelectedProperty(item);
                              setShowConfirm(true);
                            }}
                            className="h-11 rounded-xl bg-green-600 text-white hover:bg-green-900 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <BanknoteCheck size={17} />
                            Terjual
                          </button>
                        )}

                        {item.status === 1 && item.exclusive === 0 && (
                          <button
                            onClick={() => {
                              setSelectedReactivate(item);
                              setShowConfirmActive(true);
                            }}
                            className="h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                          >
                            Aktifkan Kembali
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-8">
                        <div className="h-11 rounded-xl bg-green-600 text-white flex items-center justify-center font-semibold">
                          Properti Sudah Laku
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-2xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-300 cursor-pointer"
              >
                Sebelumnya
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-3xl font-semibold transition cursor-pointer ${
                    currentPage === index + 1
                      ? "bg-blue-700 text-white"
                      : "bg-white border border-gray-300 hover:bg-blue-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-2xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-300 cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          )}
          {showConfirm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-3">
                  Tandai Properti Terjual
                </h2>

                <p className="text-gray-600">
                  Apakah Anda yakin properti
                  <span className="font-semibold">
                    {" "}
                    {selectedProperty?.name}{" "}
                  </span>
                  sudah berhasil terjual?
                </p>

                <p className="text-sm text-red-500 mt-3">
                  Status ini tidak dapat dikembalikan.
                </p>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      setSelectedProperty(null);
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleSold}
                    className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  >
                    Ya, Sudah Terjual
                  </button>
                </div>
              </div>
            </div>
          )}
          {showNotif && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <BanknoteCheck className="text-green-600" size={34} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-5">
                  Berhasil
                </h2>
                <p className="text-gray-600 mt-3">{notifMessage}</p>
                <button
                  onClick={() => setShowNotif(false)}
                  className="mt-6 w-full h-11 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          )}
          {showConfirmActive && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
                <p className="text-gray-600">
                  Apakah Anda ingin mengaktifkan kembali promosi properti ini?
                </p>

                <p className="text-sm text-red-500 mt-3">
                  Status ini tidak dapat dikembalikan.
                </p>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowConfirmActive(false);
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleGenerateQRIS}
                    className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loadingQris ? "Memproses..." : "Ya, Aktifkan Kembali"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {showNotifActive && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <BanknoteCheck className="text-green-600" size={34} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-5">
                  Berhasil Mengaktifkan Kembali Promosi
                </h2>
                <button
                  onClick={() => setShowNotifActive(false)}
                  className="mt-6 w-full h-11 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          )}
          {showQris && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-[430px]">
                <h2 className="text-2xl font-bold text-center">
                  Pembayaran QRIS
                </h2>
                <p className="text-center text-gray-500 mt-2">
                  Silakan scan QRIS berikut
                </p>
                <div className="flex justify-center mt-6">
                  <img src={qrisData?.qrImage} className="w-72" />
                </div>
                <div className="mt-5 text-center">
                  <div className="text-xl font-bold text-green-700">
                    Rp15.000
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Menunggu pembayaran...
                  </div>
                </div>
              </div>
            </div>
          )}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-3">Hapus Properti</h2>

                <p>
                  Yakin ingin menghapus properti
                  <span className="font-semibold"> {selectedDelete?.name}</span>
                  ?
                </p>

                <p className="text-red-500 text-sm mt-3">
                  Data yang sudah dihapus tidak dapat dikembalikan.
                </p>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedDelete(null);
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleDelete}
                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
          {showDeleteNotif && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <Trash2 className="text-red-600" size={32} />
                </div>

                <h2 className="text-2xl font-bold mt-5">Berhasil</h2>

                <p className="mt-3 text-gray-600">{deleteMessage}</p>

                <button
                  onClick={() => setShowDeleteNotif(false)}
                  className="mt-6 w-full h-11 rounded-xl bg-blue-800 hover:bg-blue-900 text-white cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DashboardIntern;
