import React from 'react'
import { useEffect, useState } from "react";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import Navbar from '../pages/Navbar'
import Headline from '../pages/Headline'
import Footer from './Footer';
import { useNavigate } from "react-router-dom";
function DashboardPublic() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.log(err));
  }, []);

  const formatPrice = (price) =>
    Number(price).toLocaleString("id-ID");
  return (
    <>
    <Navbar></Navbar>
    <Headline></Headline>
    <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-slate-800">
            Properti Terbaru
          </h2>
          <p className="text-slate-500 mt-2">
            Temukan rumah, apartemen, dan ruko terbaik.
          </p>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {properties.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/property/${item.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={`http://localhost:5000/uploads/${item.images[0]}`}
                  alt={item.name}
                  className="h-56 w-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-blue-800 text-white text-sm px-4 py-1 rounded-full">
                  {item.type}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-slate-500">
                  <MapPin size={16} />
                  <span className="line-clamp-1">
                    {item.city}
                  </span>
                </div>
                <p className="mt-5 text-2xl font-bold text-blue-800">
                  Rp {formatPrice(item.price)}
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                  <div>
                    <BedDouble
                      size={18}
                      className="mx-auto mb-1 text-blue-700"
                    />
                    <p>{item.kt}</p>
                  </div>
                  <div>
                    <Bath
                      size={18}
                      className="mx-auto mb-1 text-blue-700"
                    />
                    <p>{item.km}</p>
                  </div>
                  <div>
                    <div className='text-blue-800'>LB</div>
                    <p>{item.luasBangunan} m²</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default DashboardPublic
