import React, { useState, useEffect, useRef } from "react";
import {
  ImagePlus,
  Plus,
  Trash2,
  Save,
  Home,
  MapPin,
  Zap,
  Ruler,
  FileText,
  Bed,
  Bath,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import NavbarIntern from "./NavbarIntern";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Promotion() {
  const intervalRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const paymentHandledRef = useRef(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    village: "",
    district: "",
    building: "Rumah",
    priceType: "global",
    price: "",
    pricePerMeter: "",
    lenght: "",
    width: "",
    luasTanah: "",
    luasBangunan: "",
    listrik: "",
    type: "Dijual",
    kt: "",
    ktPlus: "",
    km: "",
    kmPlus: "",
    sertifikat: "",
  });

  const [images, setImages] = useState([]);
  const [deskripsi, setDeskripsi] = useState([""]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [exclusive, setExclusive] = useState(0);

  const [showNotif, setShowNotif] = useState(false);
  const [showNotifImage, setShowNotifImage] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    const missing = [];

    if (!formData.name.trim()) missing.push("Nama Properti");
    if (!formData.district) missing.push("Kecamatan");
    if (!formData.village) missing.push("Kelurahan");
    if (!formData.address.trim()) missing.push("Alamat");

    if (formData.priceType === "global") {
      if (!formData.price) missing.push("Harga");
    } else {
      if (!formData.pricePerMeter) missing.push("Harga per m²");
    }

    if (!formData.building) missing.push("Tipe Properti");
    if (!formData.type) missing.push("Kategori");

    if (!formData.luasTanah) missing.push("Luas Tanah");
    if (!formData.luasBangunan) missing.push("Luas Bangunan");
    if (!formData.listrik) missing.push("Listrik");

    if (!formData.kt) missing.push("Kamar Tidur");
    if (!formData.km) missing.push("Kamar Mandi");

    if (!formData.sertifikat.trim()) missing.push("Sertifikat");

    if (images.length === 0) missing.push("Foto Properti");

    const desc = deskripsi.filter((d) => d.trim() !== "");

    if (desc.length === 0) missing.push("Deskripsi");

    return missing;
  };

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
      setShowNotifImage(true);
    }
    setImages(newImages);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    if (saving) return;

    setSaving(true);
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const token = localStorage.getItem("token");

      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      images.forEach((img) => {
        form.append("images", img);
      });

      form.append("deskripsi", JSON.stringify(deskripsi));

      const response = await fetch( `${import.meta.env.VITE_API_URL}/promotion`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("promotionDraft");

        setShowConfirm(false);
        setShowNotif(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
      isSubmittingRef.current = false;
    }
  };

  useEffect(() => {
    fetch(
      "https://www.emsifa.com/api-wilayah-indonesia/api/districts/3578.json",
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
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${id}.json`,
      );

      const data = await res.json();
      setVillages(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch( `${import.meta.env.VITE_API_URL}/exclusive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setExclusive(data.exclusive);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const pending = JSON.parse(localStorage.getItem("pendingPromotionPayment"));

    const dataForm = pending?.formData ?? formData;

    if (!pending) return;

    setQrisData({
      qrImage: pending.qrImage,
    });

    setShowQris(true);

    checkPayment(pending.partner_ref_no);
  }, []);

  const handlePayment = () => {
    localStorage.setItem(
      "promotionData",
      JSON.stringify({
        formData,
        deskripsi,
      }),
    );

    navigate("/payment");
  };

  const [showQris, setShowQris] = useState(false);
  const [qrisData, setQrisData] = useState(null);
  const [loadingQris, setLoadingQris] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleGenerateQRIS = async () => {
    if (loadingQris) return;
    setLoadingQris(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/generate-qris`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 2500,
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
      setQrisData(data);

      localStorage.setItem(
        "pendingPromotionPayment",
        JSON.stringify({
          partner_ref_no: data.partner_ref_no,
          qrImage: data.qrImage,
          formData,
          deskripsi,
        }),
      );
      setShowConfirm(false);
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
    checkPayment(partner_ref_no);
  };

  const checkPayment = (partner_ref_no) => {
    if (intervalRef.current) {
      return;
    }

    const token = localStorage.getItem("token");

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(
           `${import.meta.env.VITE_API_URL}/payment/query/${partner_ref_no}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (data.responseData?.qrisStatus === "PAID") {
          if (paymentHandledRef.current) return;
          paymentHandledRef.current = true;

          clearInterval(intervalRef.current);
          intervalRef.current = null;

          localStorage.removeItem("pendingPromotionPayment");
          setShowQris(false);

          await handleSubmit();
        }
      } catch (err) {
        console.log(err);
      }
    }, 3000);
  };

  const formatPrice = (value) => {
    if (!value) return "";

    return Number(value).toLocaleString("id-ID");
  };
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      price: value,
    }));
  };

  useEffect(() => {
    if (formData.length && formData.width) {
      setFormData((prev) => ({
        ...prev,

        luasTanah: Number(prev.length) * Number(prev.width),
      }));
    }
  }, [formData.length, formData.width]);

  const [showKtPlus, setShowKtPlus] = useState(false);
  const [showKmPlus, setShowKmPlus] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "promotionDraft",
      JSON.stringify({
        formData,
        deskripsi,
        districtId,
        showKtPlus,
        showKmPlus,
      }),
    );
  }, [formData, deskripsi, districtId, showKtPlus, showKmPlus]);

  useEffect(() => {
    const draft = localStorage.getItem("promotionDraft");

    if (!draft) return;

    const data = JSON.parse(draft);

    setFormData(data.formData);
    setDeskripsi(data.deskripsi);
    setDistrictId(data.districtId || "");
    setShowKtPlus(data.showKtPlus || false);
    setShowKmPlus(data.showKmPlus || false);
  }, []);

  useEffect(() => {
    if (!districtId) return;

    const loadVillage = async () => {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`,
      );

      const data = await res.json();

      setVillages(data);
    };

    loadVillage();
  }, [districtId]);

  return (
    <>
      <NavbarIntern />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-10 py-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-800 hover:text-blue-600 font-medium mb-5 cursor-pointer transition"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <h1 className="text-4xl font-bold text-blue-800 mb-10">
            Tambah Properti Baru
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const missing = validateForm();

              if (missing.length > 0) {
                setMissingFields(missing);
                setShowValidation(true);
                return;
              }

              setShowConfirm(true);
            }}
            className="space-y-10"
          >
            <div className="border-b border-slate-300 pb-8">
              <h2 className="text-xl font-semibold mb-6">Informasi Properti</h2>

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
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4 focus:ring-2 focus:ring-blue-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium block mb-2">Kecamatan</label>

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
                    <label className="font-medium block mb-2">Kelurahan</label>

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
                <label className="font-medium block mb-2">Alamat</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none"
                />
              </div>
              <div className="mt-6">
                <label className="font-medium block mb-2">Jenis Harga</label>

                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 cursor-pointer"
                >
                  <option value="global">Harga Global</option>

                  <option value="perMeter">Harga per m²</option>
                </select>
              </div>
              <div className="mt-6">
                <label className="font-medium block mb-2">
                  {formData.priceType === "global" ? "Harga" : "Harga / m²"}
                </label>

                <input
                  type="text"
                  placeholder="Rp. 0,00"
                  value={
                    formData.priceType === "global"
                      ? formatPrice(formData.price)
                      : formatPrice(formData.pricePerMeter)
                  }
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    if (formData.priceType === "global") {
                      setFormData((prev) => ({
                        ...prev,
                        price: value,
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        pricePerMeter: value,
                      }));
                    }
                  }}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4"
                />
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
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none cursor-pointer"
                  >
                    <option value="Rumah">Rumah</option>
                    <option value="Ruko">Ruko</option>
                    <option value="Tanah">Tanah</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium block mb-2">Kategori</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-blue-700 outline-none cursor-pointer"
                  >
                    <option value="Dijual">Dijual</option>
                    <option value="Disewa">Disewa</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-6 mt-6">
                <div>
                  <label className="font-medium block mb-2">
                    Dimensi Tanah
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="length"
                      placeholder="Panjang"
                      value={formData.length}
                      onChange={handleChange}
                      className="w-full h-12 rounded-lg border border-gray-300 px-4"
                    />

                    <span className="font-semibold">×</span>

                    <input
                      type="number"
                      name="width"
                      placeholder="Lebar"
                      value={formData.width}
                      onChange={handleChange}
                      className="w-full h-12 rounded-lg border border-gray-300 px-4"
                    />

                    <span className="text-gray-500">m</span>
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-2">Luas Tanah</label>
                  <div className="relative flex flex-row items-center gap-2">
                    <Ruler
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="double"
                      name="luasTanah"
                      value={formData.luasTanah}
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                    <p className="text-gray-500">m²</p>
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    Luas Bangunan
                  </label>
                  <div className="relative flex flex-row items-center gap-2">
                    <Ruler
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="number"
                      name="luasBangunan"
                      value={formData.luasBangunan}
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                    <p className="text-gray-500">m²</p>
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-2">Listrik</label>
                  <div className="relative flex flex-row items-center gap-2">
                    <Zap
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="number"
                      name="listrik"
                      value={formData.listrik}
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                    <p className="text-gray-500">Watt</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="font-medium block mb-2">Kamar Tidur</label>

                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Bed
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                      />

                      <input
                        type="number"
                        name="kt"
                        value={formData.kt}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                      />
                    </div>

                    {showKtPlus && (
                      <>
                        <span className="font-bold text-lg">+</span>

                        <input
                          type="number"
                          name="ktPlus"
                          value={formData.ktPlus}
                          onChange={handleChange}
                          onWheel={(e) => e.target.blur()}
                          className="w-20 h-12 rounded-lg border border-gray-300 text-center"
                        />
                      </>
                    )}
                  </div>

                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showKtPlus}
                      onChange={(e) => {
                        setShowKtPlus(e.target.checked);

                        if (!e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            ktPlus: "",
                          }));
                        }
                      }}
                    />

                    <span className="text-sm text-gray-600">Tambahkan +</span>
                  </label>
                </div>
                <div>
                  <label className="font-medium block mb-2">Kamar Mandi</label>

                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Bath
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                      />

                      <input
                        type="number"
                        name="km"
                        value={formData.km}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                      />
                    </div>

                    {showKmPlus && (
                      <>
                        <span className="font-bold text-lg">+</span>

                        <input
                          type="number"
                          name="kmPlus"
                          value={formData.kmPlus}
                          onChange={handleChange}
                          onWheel={(e) => e.target.blur()}
                          className="w-20 h-12 rounded-lg border border-gray-300 text-center"
                        />
                      </>
                    )}
                  </div>

                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showKmPlus}
                      onChange={(e) => {
                        setShowKmPlus(e.target.checked);

                        if (!e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            kmPlus: "",
                          }));
                        }
                      }}
                    />

                    <span className="text-sm text-gray-600">Tambahkan +</span>
                  </label>
                </div>
                <div>
                  <label className="font-medium block mb-2">Sertifikat</label>
                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="text"
                      name="sertifikat"
                      value={formData.sertifikat}
                      onChange={handleChange}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-12 px-4"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-300 pb-8">
              <h2 className="text-xl font-semibold mb-6">Foto Properti</h2>
              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-4">
                  <label className="cursor-pointer h-52 border-2 border-dashed border-blue-300 rounded-2xl bg-white flex flex-col justify-center items-center hover:bg-blue-50 transition">
                    <ImagePlus size={45} className="text-blue-700" />
                    <p className="mt-3 font-medium">Upload Foto</p>
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
                      <div
                        key={index}
                        className="relative h-36 rounded-lg overflow-hidden border group"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md bg-red-600 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>

                        {/* Nomor foto */}
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">Deskripsi</h2>
                <button
                  type="button"
                  onClick={addDescription}
                  className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 h-11 rounded-xl cursor-pointer"
                >
                  <Plus size={18} />
                  Tambah
                </button>
              </div>

              <div className="space-y-4">
                {deskripsi.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <textarea
                      rows={3}
                      value={item}
                      onChange={(e) => changeDescription(index, e.target.value)}
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
                  exclusive === 1
                    ? "bg-blue-800 hover:bg-blue-900"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Save size={18} />
                {exclusive === 1 ? "Simpan Properti" : "Bayar & Promosikan"}
              </button>
            </div>
          </form>
        </div>
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
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
                  disabled={exclusive === 1 ? saving : loadingQris || showQris}
                  onClick={() => {
                    if (exclusive === 1) {
                      handleSubmit();
                    } else {
                      handleGenerateQRIS();
                    }
                  }}
                  className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-300
                  ${
                    (exclusive === 1 && saving) ||
                    (exclusive !== 1 && loadingQris)
                      ? "bg-gray-400 cursor-not-allowed"
                      : exclusive === 1
                        ? "bg-blue-700 hover:bg-blue-800 cursor-pointer"
                        : "bg-green-600 hover:bg-green-700 cursor-pointer"
                  }`}
                >
                  {exclusive === 1
                    ? saving
                      ? "Menyimpan..."
                      : "Ya, Simpan"
                    : loadingQris
                      ? "Membuat QRIS..."
                      : "Bayar"}
                </button>
              </div>
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
                Data Berhasil Disimpan
              </h2>
              <button
                onClick={() => {
                  setShowNotif(false);
                  navigate("/dashboardIntern");
                }}
                className="mt-6 w-full h-11 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        )}
        {showQris && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
            <div className="bg-white rounded-2xl p-8 w-[430px]">
              <h2 className="text-2xl font-bold text-center">
                Pembayaran QRIS
              </h2>
              <p className="text-center text-gray-600 mt-2">
                Silakan scan QRIS berikut
              </p>
              <p className="text-center text-gray-500 mt-2">
                Bisa dengan melakukan screenshot jika menggunakan 1 device atau
                langsung scan dari layar.
              </p>
              <div className="flex justify-center mt-6">
                <img src={qrisData?.qrImage} className="w-72" />
              </div>
              <div className="mt-5 text-center">
                <div className="text-xl font-bold text-green-700">Rp15.000</div>
                <div className="text-sm text-gray-500 mt-2">
                  Menunggu pembayaran...
                </div>
              </div>
            </div>
          </div>
        )}
        {showValidation && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
            <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl">
              <h2 className="text-xl font-bold text-red-600">
                Data Belum Lengkap
              </h2>

              <p className="text-gray-600 mt-2">
                Silakan lengkapi data berikut:
              </p>

              <ul className="mt-4 space-y-2 max-h-72 overflow-y-auto">
                {missingFields.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="text-red-500 font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowValidation(false)}
                  className="px-5 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        {showNotifImage && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
            <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Bookmark className="text-blue-800" size={34} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-5">
                Maksimal Foto yang disimpan adalah 10 Foto
              </h2>
              <button
                onClick={() => {
                  setShowNotifImage(false);
                }}
                className="mt-6 w-full h-11 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Promotion;
