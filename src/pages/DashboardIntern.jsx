import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavbarIntern from "./NavbarIntern";
import Footer from "./Footer";

function DashboardIntern() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;

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

        if (data.length > 0) {
        }
        if (data) {
          setProperties(data);
          if (data.length > 0) {
            setExclusive(data[0].exclusive);
          }
        }
      });
  }, []);

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

    const search = keyword.toLowerCase();

    const matchKeyword =
      item.name.toLowerCase().includes(search) ||
      item.district.toLowerCase().includes(search) ||
      item.village.toLowerCase().includes(search) ||
      item.address.toLowerCase().includes(search);

    return matchStatus && matchKeyword;
  });

  const handleReactivate = async (id) => {
    const token = localStorage.getItem("token");

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
      setShowNotifActive(true);
    }
  };

  const handleSold = async () => {
    if (!selectedProperty) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/properties/${selectedProperty.id}/sold`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
            : item
        )
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
    indexOfLastProperty
  );

  const totalPages = Math.ceil(
    filteredProperties.length / propertiesPerPage
  );

  const [showNotif, setShowNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState(""); 
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNotifActive, setShowNotifActive] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null); 

  const [selectedReactivate, setSelectedReactivate] = useState(null);
  const [showConfirmActive, setShowConfirmActive] = useState(false);
  const [showQris, setShowQris] = useState(false);
  const [qrisData, setQrisData] = useState(null);
  const [loadingQris, setLoadingQris] = useState(false);

  const handleGenerateQRIS = async () => {
    try{
      setLoadingQris(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/payment/generate-qris",
        {
          method:"POST",
          headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${token}`
          },
          body:JSON.stringify({
              amount:15000
          })
        }
      );

      const data = await res.json();
      console.log("Generate QRIS:", data);
      console.log("HTTP:", res.status);
      setLoadingQris(false);

      if(!res.ok){
        alert(data.message);
        return;
      }
      setQrisData(data);
      setShowConfirmActive(false);
      setShowQris(true);
      console.log("Memulai polling");
      startCheckingPayment(data.partner_ref_no);
    }catch(err){
      console.log(err);
      setLoadingQris(false);
      alert("Server Error");
    }
  }

  const startCheckingPayment = (partner_ref_no)=>{
    console.log("startCheckingPayment dipanggil");
    console.log(partner_ref_no);

    const token = localStorage.getItem("token");
    const interval = setInterval(async()=>{
      const res = await fetch(
        `http://localhost:5000/payment/query/${partner_ref_no}`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
      );
      const data = await res.json();
      console.log(data);
      console.log(data.responseData.qrisStatus);
      if(data.responseData?.qrisStatus ==="PAID"){
        clearInterval(interval);
        console.log("Pembayaran berhasil");
        setShowQris(false);
        await handleReactivate(selectedReactivate.id);
      }
    },3000);
  }

  const totalJual = properties.filter(
    (item) => item.type === "Dijual" && item.soldStatus === 0
  ).length;

  const totalSewa = properties.filter(
    (item) => item.type === "Disewa" && item.soldStatus === 0
  ).length;

  const totalLaku = properties.filter(
    (item) => item.soldStatus === 1
  ).length;
  return (
    <>
      <NavbarIntern />
      <div className="bg-white max-h-full ">
        <div className="relative bg-white text-blue-800 px-5 sm:px-8 md:px-16 lg:px-32 py-10 md:py-16">
              <h1 className="text-3xl md:text-4xl font-bold">
                  Properti Saya
              </h1>
              <p className="text-gray-800 mt-2">
                  Kelola seluruh promosi properti Anda dengan mudah.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                <div className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-lg">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500 flex items-center justify-center">
                    <Home size={30} className="text-white md:w-9 md:h-9"/>
                  </div>
                  <div>
                    <div className="text-gray-500 font-medium">
                      Dijual
                    </div>
                    <div className="text-4xl font-bold text-green-600">
                      {totalJual}
                    </div>
                    <div className="text-gray-500">
                      Properti
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-lg">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-500 flex items-center justify-center">
                    <KeyRound className="text-white md:w-9 md:h-9" size={30} />
                  </div>
                  <div>
                    <div className="text-gray-500 font-medium">
                      Disewakan
                    </div>
                    <div className="text-4xl font-bold text-orange-500">
                      {totalSewa}
                    </div>
                    <div className="text-gray-500">
                      Properti
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-lg">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-800 flex items-center justify-center">
                    <CircleCheckBig className="text-white md:w-9 md:h-9" size={30}/>
                  </div>
                  <div>
                    <div className="text-gray-500 font-medium">
                      Sudah Laku
                    </div>
                    <div className="text-4xl font-bold text-blue-800">
                      {totalLaku}
                    </div>
                    <div className="text-gray-500">
                      Properti
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-10">
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
              onClick={() => {
                setStatusFilter("sold");
                setCurrentPage(1)}}
              className={`w-full sm:w-auto px-6 h-12 rounded-xl cursor-pointer ${
                statusFilter === "sold"
                  ? "bg-green-600 text-white"
                  : "bg-green-600 text-white hover:bg-green-800"
              }`}
            >
              Properti Terjual
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
                  src={`http://localhost:5000/uploads/${item.images[0]}`}
                  className="w-full h-60 object-cover"
                  alt=""
                />

                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold">
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
                    {" "}{selectedProperty?.name}{" "}
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
                <p className="text-gray-600 mt-3">
                  {notifMessage}
                </p>
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
                  <img
                      src={qrisData?.qrImage}
                      className="w-72"
                  />  
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
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default DashboardIntern;