import React, { useEffect, useState } from "react";
import Navbar from './Navbar'
import SearchNav from './SearchNav'
import Footer from './Footer'
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Rent() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
      fetch("http://localhost:5000/properties/rent")
        .then((res) => res.json())
        .then((data) => setProperties(data))
        .catch(console.error);
    }, []);

  return (
    <>
    <Navbar/>
    <SearchNav/>
    <div className="max-w-7xl mx-auto px-8 py-10">
      <h1 className="text-4xl font-bold text-blue-900 mb-2">
        Properti Disewakan
      </h1>
      <p className="text-gray-500 mb-8">
        Temukan rumah impian Anda.
      </p>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl duration-300 cursor-pointer"
            onClick={() => navigate(`/property/${property.id}`)}
          >
            <div className="relative">
              <img
                src={`http://localhost:5000/uploads/${property.images[0]}`}
                alt=""
                className="h-60 w-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-blue-800 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Disewa
              </span>
            </div>
            <div className="p-6">
              <h2 className="font-bold text-2xl">
                {property.name}
              </h2>
              <div className="flex items-center gap-2 mt-3 text-gray-500">
                <MapPin size={18} />
                {property.city}
              </div>
              <h3 className="text-2xl text-blue-800 font-bold mt-5">
                Rp {Number(property.price).toLocaleString("id-ID")}
              </h3>
              <div className="grid grid-cols-3 mt-6 border-t pt-5">
                <div className="flex flex-col items-center">
                  <BedDouble className="text-blue-700" />
                  <span>{property.kt} KT</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bath className="text-blue-700" />
                  <span>{property.km} KM</span>
                </div>
                <div className="flex flex-col items-center">
                  <Ruler className="text-blue-700" />
                  <span>{property.luasBangunan} m²</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {properties.length === 0 && (
        <div className="text-center py-24 text-gray-500">
          Belum ada properti disewakan.
        </div>
      )}
    </div>
    <Footer/>
    </>
  )
}

export default Rent
