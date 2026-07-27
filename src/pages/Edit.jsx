import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarIntern from "./NavbarIntern";
import {ImagePlus, Plus, Trash2, Save, Home, MapPin, Zap, Ruler, FileText, Bed, Bath} from "lucide-react";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [deskripsi, setDeskripsi] = useState([""]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [districtId, setDistrictId] = useState("");

  const [formData, setFormData] = useState({
      name:"",
      address:"",
      village:"",
      district:"",
      building:"",
      price:"",
      luasTanah:"",
      luasBangunan:"",
      listrik:"",
      type:"",
      kt:"",
      km:"",
      sertifikat:"",
      deskripsi:[]
  });

  useEffect(() => {

      const token = localStorage.getItem("token");

      fetch(`http://localhost:5000/property/${id}`,{
          headers:{
              Authorization:`Bearer ${token}`
          }
      })
      .then(res=>res.json())
      .then((data) => {
        setFormData({
          name: data.name || "",
          address: data.address || "",
          village: data.village || "",
          district: data.district || "",
          building: data.building || "",
          price: data.price || "",
          luasTanah: data.luasTanah || "",
          luasBangunan: data.luasBangunan || "",
          listrik: data.listrik || "",
          type: data.type || "",
          kt: data.kt || "",
          km: data.km || "",
          sertifikat: data.sertifikat || "",
        });

        setDeskripsi(data.deskripsi || []);
        setImages(data.images || []);
      });

  },[]);

  const handleChange=(e)=>{
      setFormData({
          ...formData,
          [e.target.name]:e.target.value
      });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
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

  const form = new FormData();

  Object.keys(formData).forEach(key=>{
      form.append(key, formData[key]);
  });

  images.forEach(img=>{
      if(img instanceof File){
          form.append("images",img);
      }
  });

  form.append("deskripsi",JSON.stringify(deskripsi)); 

  const handleSubmit=async(e)=>{
      e.preventDefault();

      const token=localStorage.getItem("token");

      const res=await fetch(`http://localhost:5000/property/${id}`,{
          method:"PUT",
          headers:{
              Authorization:`Bearer ${token}`
          },
          body:form
      });

      const data=await res.json();

      alert(data.message);

      if(res.ok){
          navigate("/dashboardIntern");
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

  return (
    <>
    <NavbarIntern/>
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-10 py-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-10">
          Edit Properti
        </h1>
        <form onSubmit={handleSubmit} className="space-y-10">
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
                    value={formData.name}
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
                      Keluarahan
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
                value={formData.address}
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
                    value={formData.price}
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
                  <option>Rumah</option>
                  <option>Apartemen</option>
                  <option>Ruko</option>
                  <option>Tanah</option>
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
                  <option>Dijual</option>
                  <option>Disewa</option>
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
                    value={formData.luasTanah}
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
                    value={formData.luasBangunan}
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
                    value={formData.listrik}
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
                    value={formData.kt}
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
                    value={formData.km}
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
                    value={formData.sertifikat}
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
                </label>
              </div>

              <div className="md:col-span-8">
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={
                          img instanceof File
                              ? URL.createObjectURL(img)
                              : `http://localhost:5000/uploads/${img}`
                      }
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
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 h-11 rounded-xl"
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
              onClick={handleSubmit}
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white px-8 h-12 rounded-xl flex items-center gap-3 font-semibold shadow-lg"
            >
              <Save size={18} />
              Simpan Properti
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default Edit;