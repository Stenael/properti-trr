import React, { useEffect, useState } from "react";
import { Search, MapPin, Wallet } from "lucide-react";

function SearchNav() {
  const handleSearch = (e) => {
    e.preventDefault();

    console.log({
      keyword,
      province,
      city,
      price,
    });
  };

  const [keyword, setKeyword] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("https://ibnux.github.io/data-indonesia/provinsi.json")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.log(err));
  }, []);

  const handleProvinceChange = async (e) => {
    const provinsiId = e.target.value;
    setProvince(provinsiId);
    setCity("");
    if (!provinsiId) {
      setCities([]);
      return;
    }
    try {
      const res = await fetch(
        `https://ibnux.github.io/data-indonesia/kabupaten/${provinsiId}.json`
      );
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-blue-700 py-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex justify-center">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-2xl flex items-center overflow-hidden w-full max-w-6xl"
        >
          <div className="flex items-center flex-1 px-6">
            <Search className="text-blue-800" size={22} />
            <input
              type="text"
              placeholder="Cari rumah, apartemen, ruko..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full h-16 px-4 outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div className="flex items-center px-5">
            <MapPin className="text-blue-800 mr-2" size={20} />
            <select
              value={province}
              onChange={handleProvinceChange}
              className="h-16 outline-none cursor-pointer bg-transparent text-gray-700"
            >
              <option value="">Semua Provinsi</option>
              {provinces.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div className="flex items-center px-5">
            <MapPin className="text-blue-800 mr-2" size={20} />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!province}
              className="h-16 outline-none cursor-pointer bg-transparent text-gray-700"
            >
              <option value="">Semua Kota</option>

              {cities.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div className="flex items-center px-5">
            <Wallet className="text-blue-800 mr-2" size={20} />
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-16 outline-none cursor-pointer bg-transparent text-gray-700"
            >
              <option value="">Semua Harga</option>
              <option value="500">≤ 500 Juta</option>
              <option value="1000">≤ 1 Miliar</option>
              <option value="2000">≤ 2 Miliar</option>
              <option value="5000">≥ 5 Miliar</option>
            </select>
          </div>
          <div className="p-2">
            <div className="bg-gray-100 rounded-xl p-1 shadow-inner">
              <button
                type="submit"
                className="h-12 px-8 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
              >
                <Search size={18} />
                Cari
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchNav;