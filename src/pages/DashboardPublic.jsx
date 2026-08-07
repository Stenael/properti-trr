import React from "react";
import { useEffect, useState } from "react";
import {
  MapPin,
  BedDouble,
  Bath,
  LandPlot,
  House,
  MessageCircle,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../pages/Navbar";
import Headline from "../pages/Headline";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
function DashboardPublic() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState({});
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("http://192.168.101.37:5000/propertiesAll")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.log(err));
  }, []);

  const formatPrice = (price) => Number(price).toLocaleString("id-ID");

  const nextImage = (property) => {
    setCurrentImage((prev) => {
      const index = prev[property.id] || 0;

      return {
        ...prev,
        [property.id]: index === property.images.length - 1 ? 0 : index + 1,
      };
    });
  };

  const prevImage = (property) => {
    setCurrentImage((prev) => {
      const index = prev[property.id] || 0;

      return {
        ...prev,
        [property.id]: index === 0 ? property.images.length - 1 : index - 1,
      };
    });
  };
  return (
    <>
      <Navbar></Navbar>
      <Headline></Headline>
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-800">
            Properti Terbaru
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-2">
            Temukan rumah, apartemen, dan ruko terbaik.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {properties.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/property/${item.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={`http://192.168.101.37:5000/uploads/${
                    item.images[currentImage[item.id] || 0]
                  }`}
                  alt={item.name}
                  className="h-56 w-full object-cover transition"
                />
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage(item);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage(item);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                {item.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {item.images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          (currentImage[item.id] || 0) === i
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {item.type}
                  </span>

                  <span className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1 rounded-full shadow backdrop-blur">
                    {item.building}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg md:text-xl line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <MapPin size={16} />
                  <span className="line-clamp-1">
                    {item.district}, {item.village}
                  </span>
                </div>
                <p className="mt-5 text-2xl font-bold text-green-600">
                  Rp {formatPrice(item.price)}
                </p>
                <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                  <div>
                    <BedDouble
                      size={20}
                      className="mx-auto mb-1 text-blue-700"
                    />
                    <p>{item.kt} KT</p>
                  </div>
                  <div>
                    <Bath size={20} className="mx-auto mb-1 text-blue-700" />
                    <p>{item.km} KM</p>
                  </div>
                  <div>
                    <LandPlot
                      size={20}
                      className="mx-auto mb-1 text-blue-700"
                    />
                    <p>{item.luasTanah} m²</p>
                  </div>
                  <div>
                    <House size={20} className="mx-auto mb-1 text-blue-700" />
                    <p>{item.luasBangunan} m²</p>
                  </div>
                </div>
                <div className="mt-6 border-t pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="text-blue-700" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.ownerName}
                      </p>
                      <p className="text-sm text-gray-500">{item.ownerCity}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const message = `Halo ${item.ownerName}, 
                  Saya tertarik dengan properti yang Anda pasarkan.

                  Properti : ${item.name}
                  Lokasi : ${item.village}, ${item.district}
                  Harga : Rp ${formatPrice(item.price)}

                  Apakah properti ini masih tersedia?`;
                      window.open(
                        `https://wa.me/${item.phone_number.replace(
                          /^0/,
                          "62",
                        )}?text=${encodeURIComponent(message)}`,
                        "_blank",
                      );
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <MessageCircle size={18} />
                      <div>WhatsApp</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DashboardPublic;
