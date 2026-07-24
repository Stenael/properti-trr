import React, { useEffect, useState } from "react";
import { Search, MapPin, Wallet } from "lucide-react";

function SearchNav() {
  const handleSearch = (e) => {
    e.preventDefault();

    console.log({
      keyword,
      district,
      village,
      sortPrice,
    });
  };

  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");

  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [sortPrice, setSortPrice] = useState("");

  useEffect(() => {
    fetch(
      "https://www.emsifa.com/api-wilayah-indonesia/api/districts/3578.json"
    )
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(console.error);
  }, []);

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;

    setDistrict(districtId);
    setVillage("");

    if (!districtId) {
      setVillages([]);
      return;
    }

    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`
      );

      const data = await res.json();

      setVillages(data);
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
              value={district}
              onChange={handleDistrictChange}
              className="h-16 outline-none cursor-pointer bg-transparent text-gray-700"
            >
              <option value="">Semua Kecamatan</option>

              {districts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div className="flex items-center px-5">
            <MapPin className="text-blue-800 mr-2" size={20} />
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              disabled={!district}
              className="h-16 outline-none cursor-pointer bg-transparent text-gray-700"
            >
              <option value="">Semua Kelurahan</option>

              {villages.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div className="flex items-center px-5">
            <Wallet className="text-blue-800 mr-2" size={20} />
            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="h-16 outline-none cursor-pointer bg-transparent text-gray-700"
            >
              <option value="">Urutkan Harga</option>
              <option value="asc">Harga Terendah</option>
              <option value="desc">Harga Tertinggi</option>
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