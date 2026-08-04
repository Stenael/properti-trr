import React, { useState, useEffect } from "react";
import {ImagePlus, Plus, Trash2, Save, Home, MapPin, Zap, Ruler, FileText, Bed, Bath, Bookmark} from "lucide-react";
import NavbarIntern from "./NavbarIntern";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Promotion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    village: "",
    district: "",
    building: "Rumah",
    price: "",
    luasTanah: "",
    luasBangunan: "",
    listrik: "",
    type: "Dijual",
    kt: "",
    km: "",
    sertifikat: "",
  });

  const [images, setImages] = useState([]);
  const [deskripsi, setDeskripsi] = useState([""]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [exclusive, setExclusive] = useState(0);

  const [showNotif, setShowNotif] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 10);
    if (images.length + files.length > 10) {
      alert("Maksimal 10 gambar.");
    }
    setImages(newImages);
  };

  const addDescription = () => {
    setDeskripsi([...deskripsi, ""]);
  };

  const changeDescription = (index, value) => {
    const temp = [...deskripsi];
    temp[index] = value;
    setDeskripsi(temp);
  };

  const removeDescription = (index) => {
    const temp = [...deskripsi];
    temp.splice(index, 1);
    setDeskripsi(temp);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const form = new FormData();

    Object.keys(formData).forEach((key)=>{
        form.append(key, formData[key]);
    });

    images.forEach((img)=>{
        form.append("images", img);
    });

    form.append("deskripsi", JSON.stringify(deskripsi));
    try{

      const response = await fetch(
        "http://localhost:5000/promotion",
        {
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`
            },
            body:form
        }
      );

      const data = await response.json();

      if(response.ok){
        setShowConfirm(false);
        setShowNotif(true);
      }else{
        alert(data.message);
      }

    }catch(err){
        console.log(err);
    }
  };

  useEffect(() => {
    fetch(
      "https://www.emsifa.com/api-wilayah-indonesia/api/districts/3578.json"
    )
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(console.error);
  }, []);

  const handleDistrictChange = async (e) => {
    const id = e.target.value;

    setDistrictId(id);

    const selectedDistrict = districts.find((d) => d.id === id);

    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict?.name || "",
      village: "",
    }));

    if (!id) {
      setVillages([]);
      return;
    }

    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${id}.json`
      );

      const data = await res.json();
      setVillages(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/exclusive", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // cek hasil
        setExclusive(data.exclusive);
      })
      .catch(console.error);
  }, []);

  const handlePayment = () => {
    localStorage.setItem(
      "promotionData",
      JSON.stringify({
        formData,
        deskripsi,
      })
    );

    navigate("/payment");
  };

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
      setShowConfirm(false);
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
        await handleSubmit();
      }
    },3000);
  }

  return (
    <>
      <NavbarIntern />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-10 py-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-10">
            Tambah Properti Baru
          </h1>
          <form onSubmit={(e)=>{
                e.preventDefault();
                setShowConfirm(true);
            }} className="space-y-10">
            <div className="border-b border-slate-300 pb-8">
              <h2 className="text-xl font-semibold mb-6">
                Informasi Properti
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium block mb-2">
                    Nama Properti
                  </label>
                  <div className="relative">
                    <Home
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      name="name"
                      onChange={handleChange}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4 focus:ring-2 focus:ring-blue-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium block mb-2">
                      Kecamatan
                    </label>

                    <select
                      value={districtId}
                      onChange={handleDistrictChange}
                      className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none cursor-pointer"
                    >
                      <option value="">Pilih Kecamatan</option>

                      {districts.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-medium block mb-2">
                        Kelurahan
                    </label>

                    <select
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      disabled={!formData.district}
                      className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none cursor-pointer disabled:bg-gray-100"
                    >
                      <option value="">Pilih Kelurahan</option>

                      {villages.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="font-medium block mb-2">
                  Alamat
                </label>
                <input
                  name="address"
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none"
                />
              </div>
              <div className="mt-6">
                  <label className="font-medium block mb-2">
                    Harga
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Rp 0"
                      name="price"
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none"
                    />
                  </div>
                </div>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="font-medium block mb-2">
                    Tipe Properti
                  </label>
                  <select
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none"
                  >
                    <option value="Rumah">Rumah</option>
                    <option value="Ruko">Ruko</option>
                    <option value="Tanah">Tanah</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    Kategori
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none"
                  >
                    <option value="Dijual">Dijual</option>
                    <option value="Disewa">Disewa</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="font-medium block mb-2">
                    Luas Tanah
                  </label>
                  <div className="relative">
                    <Ruler
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="double"
                      name="luasTanah"
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    Luas Bangunan
                  </label>
                  <div className="relative">
                    <Ruler
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="number"
                      name="luasBangunan"
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    Listrik
                  </label>
                  <div className="relative">
                    <Zap
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="number"
                      name="listrik"
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="font-medium block mb-2">
                    Kamar Tidur
                  </label>
                  <div className="relative">
                    <Bed
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="number"
                      name="kt"
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    Kamar Mandi
                  </label>
                  <div className="relative">
                    <Bath
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="number"
                      name="km"
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    Sertifikat
                  </label>
                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="text"
                      name="sertifikat"
                      onChange={handleChange}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-300 pb-8">
              <h2 className="text-xl font-semibold mb-6">
                Foto Properti
              </h2>
              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-4">
                  <label className="cursor-pointer h-52 border-2 border-dashed border-blue-300 rounded-2xl bg-white flex flex-col justify-center items-center hover:bg-blue-50 transition">
                    <ImagePlus
                      size={45}
                      className="text-blue-700"
                    />
                    <p className="mt-3 font-medium">
                      Upload Foto
                    </p>
                    <p className="text-sm text-gray-500">
                      Klik untuk memilih gambar
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleImage}
                    />
                    <p className="text-xs text-red-500 mt-2">
                      Maksimal 10 gambar
                    </p>
                  </label>
                </div>

                <div className="md:col-span-8">
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt=""
                        className="rounded-lg h-36 w-full object-cover border"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">
                  Deskripsi
                </h2>
                <button
                  type="button"
                  onClick={addDescription}
                  className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 h-11 rounded-xl"
                >
                  <Plus size={18} />
                  Tambah
                </button>
              </div>

              <div className="space-y-4">
                {deskripsi.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4"
                  >
                    <textarea
                      rows={3}
                      value={item}
                      onChange={(e) =>
                        changeDescription(index, e.target.value)
                      }
                      placeholder={`Deskripsi ${index + 1}`}
                      className="flex-1 rounded-lg border border-gray-300 p-4 resize-none"
                    />
                    {deskripsi.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDescription(index)}
                        className="w-12 bg-red-500 hover:bg-red-600 text-white rounded-xl flex justify-center items-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className={`px-8 h-12 rounded-xl flex items-center gap-3 font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer
                ${
                    exclusive===1
                    ? "bg-blue-800 hover:bg-blue-900"
                    : "bg-green-600 hover:bg-green-700"
                }`}
            >
                <Save size={18}/>
                {exclusive===1
                    ? "Simpan Properti"
                    : "Bayar & Promosikan"}
            </button>
            </div>
          </form>
        </div>
        {showConfirm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">

                <h2 className="text-xl font-bold mb-3">
                  Apakah data yang anda masukkan sudah tepat?
                </h2>


                <p className="text-sm text-red-500 mt-3">
                  Status ini tidak dapat dikembalikan.
                </p>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                    }}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    Batal
                  </button>

                 <button
                    type="button"
                    onClick={() => {
                        if (exclusive === 1) {
                            handleSubmit();
                        } else {
                            handleGenerateQRIS();
                        }
                    }}
                    className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-300 cursor-pointer
                    ${
                        exclusive === 1
                            ? "bg-blue-700 hover:bg-blue-800"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {exclusive === 1 ? "Ya, Simpan" : "Bayar"}
                </button>
                </div>

              </div>
            </div>
          )}
          {showNotif && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Bookmark className="text-blue-800" size={34} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-5">
                  Data Berhasil Disimpan
                </h2>
                <button
                  onClick={() =>{
                    setShowNotif(false);
                    navigate("/dashboardIntern");} }
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
      <Footer/>
    </>
  );
}

export default Promotion;