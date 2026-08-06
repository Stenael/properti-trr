import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {MapPin, BedDouble, Bath, LandPlot, House, Zap, FileText, User, MessageCircle, ArrowLeft} from "lucide-react";

function DetailPublic() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://192.168.101.37:5000/property/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data);
        if (data.images.length > 0) {
          setMainImage(data.images[0]);
        }
      });
  }, [id]);
  if (!property)
    return (
      <>
        <Navbar />
        <div className="h-screen flex justify-center items-center">
          Loading...
        </div>
      </>
    );

  const formatPrice = (price) =>
    Number(price).toLocaleString("id-ID");

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-6">
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-800 hover:text-blue-600 font-medium mb-5 cursor-pointer transition"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 order-1">
            <img
              src={`http://192.168.101.37:5000/uploads/${mainImage}`}
              onClick={() => setShowImage(true)}
              className="w-full h-[280px] md:h-[600px] rounded-2xl object-cover shadow cursor-pointer"
            />
          </div>
          {property.images.length > 1 && (
            <div className="order-1 w-full md:w-32 flex flex-row md:flex-col gap-3 overflow-y-auto max-h-[600px]">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={`http://192.168.101.37:5000/uploads/${img}`}
                onClick={() => setMainImage(img)}
                className={`h-28 w-28 rounded-xl object-cover cursor-pointer border-4 ${
                  mainImage === img
                    ? "border-blue-700"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
          )}
        </div>
    
        <div className="grid lg:grid-cols-3 gap-10 mt-10">
          <div className="lg:col-span-2">
            <span className="bg-blue-700 text-white px-5 py-2 rounded-full">
              {property.type}
            </span>
            <h1 className="text-4xl font-bold mt-4">
              {property.name}
            </h1>
            <div className="flex items-center gap-2 mt-3 text-gray-500">
              <MapPin size={18} />
              {property.address}, {property.village},{" "}
              {property.district}
            </div>
            <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-6">
              <div className="text-center">
                <BedDouble className="mx-auto text-blue-700" />
                <p>{property.kt}</p>
                <small>Kamar Tidur</small>
              </div>
              <div className="text-center">
                <Bath className="mx-auto text-blue-700" />
                <p>{property.km}</p>
                <small>Kamar Mandi</small>
              </div>
              <div className="text-center">
                <LandPlot className="mx-auto text-blue-700" />
                <p>{property.luasTanah} m²</p>
                <small>Luas Tanah</small>
              </div>
              <div className="text-center">
                <House className="mx-auto text-blue-700" />
                <p>{property.luasBangunan} m²</p>
                <small>Luas Bangunan</small>
              </div>
              <div className="text-center">
                <Zap className="mx-auto text-blue-700" />
                <p>{property.listrik} W</p>
                <small>Listrik</small>
              </div>
              <div className="text-center">
                <FileText className="mx-auto text-blue-700" />
                <p>{property.sertifikat}</p>
                <small>Sertifikat</small>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-2">
                Dibuat tanggal
              </h2>
              <div className="mb-5">
                <p>
                  {new Date(property.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-5">
                Deskripsi
              </h2>
              <div className="space-y-0 bg-blue-50 rounded-xl">
                {property.deskripsi.map((item, index) => (
                  <div
                    key={index}
                    className="p-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-green-600">
                Rp {formatPrice(property.price)}
              </h2>
              <div className="mt-6 border-t pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="text-blue-700" size={22} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {property.ownerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {property.ownerCity}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const message = `Halo ${property.ownerName}, 
              Saya tertarik dengan properti yang Anda pasarkan.

              Properti : ${property.name}
              Lokasi : ${property.village}, ${property.district}
              Harga : Rp ${formatPrice(property.price)}

              Apakah properti ini masih tersedia?`;
                  window.open(
                    `https://wa.me/${property.phone_number.replace(
                      /^0/,
                      "62"
                    )}?text=${encodeURIComponent(message)}`,
                    "_blank"
                  );
                }}
                className="mt-6 w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-1 justify-center">
                  <MessageCircle size={18} />
                  <div>WhatsApp</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        showImage && (
        <div
            onClick={() => setShowImage(false)}
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
        >
            <img
                src={`http://192.168.101.37:5000/uploads/${mainImage}`}
                className="max-h-[90vh] max-w-[90vw] rounded-xl"
            />
        </div>
        )
        }
      <Footer />
    </>
  );
}

export default DetailPublic;
