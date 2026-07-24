import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {MapPin, BedDouble, Bath, LandPlot, House, Zap, FileText} from "lucide-react";

function DetailPublic() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/property/${id}`)
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
        <div className="flex gap-4">
          <div className="flex-1">
            <img
              src={`http://localhost:5000/uploads/${mainImage}`}
              onClick={() => setShowImage(true)}
              className="w-full h-[600px] rounded-2xl object-cover shadow cursor-pointer"
            />
          </div>
          <div className="w-32 flex flex-col gap-3 overflow-y-auto max-h-[600px]">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/uploads/${img}`}
                onClick={() => setMainImage(img)}
                className={`h-28 w-28 rounded-xl object-cover cursor-pointer border-4 ${
                  mainImage === img
                    ? "border-blue-700"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
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
              <button className="mt-4 w-full h-12 rounded-xl border border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-semibold cursor-pointer">
                WhatsApp
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
                src={`http://localhost:5000/uploads/${mainImage}`}
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
