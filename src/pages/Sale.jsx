import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import SearchNav from "./SearchNav";
import Footer from "./Footer";
import { MapPin, BedDouble, Bath, LandPlot, House, MessageCircle, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sale() {
  const [currentImage, setCurrentImage] = useState({});
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/properties/sale")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch(console.error);
  }, []);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const totalPages = Math.ceil(
    properties.length / propertiesPerPage
  );

  const nextImage = (property) => {
    setCurrentImage((prev) => {
      const index = prev[property.id] || 0;

      return {
        ...prev,
        [property.id]:
          index === property.images.length - 1
            ? 0
            : index + 1,
      };
    });
  };

  const prevImage = (property) => {
    setCurrentImage((prev) => {
      const index = prev[property.id] || 0;

      return {
        ...prev,
        [property.id]:
          index === 0
            ? property.images.length - 1
            : index - 1,
      };
    });
  };

  return (
    <>
      <Navbar />
      <SearchNav />
      <div className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Properti Dijual
        </h1>
        <p className="text-gray-500 mb-8">
          Temukan rumah impian Anda.
        </p>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {currentProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl duration-300 cursor-pointer"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              <div className="relative">
                <img src={`http://localhost:5000/uploads/${
                    property.images[currentImage[property.id] || 0]
                  }`}
                  alt={property.name}
                  className="h-56 w-full object-cover transition"
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage(property);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                    </button>
  
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage(property);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                {property.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {property.images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          (currentImage[property  .id] || 0) === i
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Dijual
                  </span>

                  <span className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1 rounded-full shadow backdrop-blur">
                    {property.building}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="font-bold text-lg">
                  {property.name}
                </h2>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <MapPin size={18} />
                  {property.district}, {property.village}
                </div>
                <h3 className="text-2xl text-green-600 font-bold mt-5">
                  Rp {Number(property.price).toLocaleString("id-ID")}
                </h3>
                <div className="grid grid-cols-4 mt-6 border-t pt-5">
                  <div className="flex flex-col items-center">
                    <BedDouble size={20} className="text-blue-700 mb-1" />
                    <span>{property.kt} KT</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bath size={20} className="text-blue-700 mb-1" />
                    <span>{property.km} KM</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <LandPlot size={20} className="text-blue-700 mb-1"/>
                    <p>{property.luasTanah} m²</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <House size={20} className="text-blue-700 mb-1"/>
                    <p>{property.luasBangunan} m²</p>
                  </div>
                </div>
                <div className="mt-6 border-t pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="text-blue-700" size={20}/>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      window.open(
                        `https://wa.me/${property.phone_number.replace(/^0/, "62")}`,
                        "_blank"
                      );
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle size={20} />
                      <div>Whatsapp</div>  
                    </div>
                  
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-2xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-blue-300"
            >
              Sebelumnya
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-3xl border-gray-300 font-semibold transition cursor-pointer ${
                  currentPage === index + 1
                    ? "bg-blue-700 text-white"
                    : "bg-white border hover:bg-blue-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-2xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-blue-300"
            >
              Berikutnya
            </button>
          </div>
        )}
        {properties.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            Belum ada properti dijual.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Sale;