import React, { useEffect, useState } from "react";
import { Search, MapPin, Wallet, Home, BedDouble, Bath } from "lucide-react";

function SearchNav({ onSearch }) {
  const handleSearch = (e) => {
    e.preventDefault();

    onSearch({
      keyword,
      district,
      village,
      building,
      kt,
      km,
      minPrice,
      maxPrice,
      sortPrice,
    });
  };
  const handleReset = () => {
    setKeyword("");
    setDistrict("");
    setVillage("");
    setVillages([]);
    setBuilding("");
    setKt("");
    setKm("");
    setMinPrice("");
    setMaxPrice("");
    setSortPrice("");

    onSearch({
      keyword: "",
      district: "",
      village: "",
      building: "",
      kt: "",
      km: "",
      minPrice: "",
      maxPrice: "",
      sortPrice: "",
    });
  };

  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");

  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [sortPrice, setSortPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [building, setBuilding] = useState("");
  const [kt, setKt] = useState("");
  const [km, setKm] = useState("");

  useEffect(() => {
    fetch(
      "https://www.emsifa.com/api-wilayah-indonesia/api/districts/3578.json",
    )
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(console.error);
  }, []);

  const handleDistrictChange = async (e) => {
    const districtName = e.target.value;

    setDistrict(districtName);

    const selected = districts.find((d) => d.name === districtName);

    const districtId = selected?.id;
    setVillage("");

    if (!districtId) {
      setVillages([]);
      return;
    }
    const res = await fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`,
    );
    const data = await res.json();
    setVillages(data);
  };

  const [showFilter, setShowFilter] = useState(false);

  const formatNumber = (value) => {
    if (!value) return "";

    return Number(value).toLocaleString("id-ID");
  };

  const handlePriceChange = (e, setter) => {
    const value = e.target.value.replace(/\D/g, ""); // hanya angka
    setter(value);
  };

  return (
    <div className="w-full bg-blue-800  py-8 px-3 shadow-lg">
      <div className="bg-white rounded-3xl shadow-2xl p-5">
        <div className="hidden lg:block">
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5 flex items-center border border-gray-300 rounded-xl px-4 h-16">
                <Search className="text-blue-700 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Cari rumah, ruko, tanah..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
              <div className="col-span-3 flex items-center border border-gray-300 rounded-xl px-4 h-16">
                <MapPin className="text-blue-700 mr-2" size={20} />
                <select
                  value={district}
                  onChange={handleDistrictChange}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Semua Kecamatan</option>
                  {districts.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex items-center border border-gray-300 rounded-xl px-4 h-16">
                <MapPin className="text-blue-700 mr-2" size={20} />
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  disabled={!district}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Kelurahan</option>
                  {villages.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 h-16 text-sm rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition cursor-pointer"
                >
                  Reset Filter
                </button>

                <button
                  type="submit"
                  className="flex-1 h-16 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 transition cursor-pointer"
                >
                  Cari
                </button>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2 flex items-center border border-gray-300 rounded-xl px-4 h-14">
                <Home className="mr-2 text-blue-700" size={18} />
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Semua Properti</option>
                  <option value="Rumah">Rumah</option>
                  <option value="Ruko">Ruko</option>
                  <option value="Tanah">Tanah</option>
                </select>
              </div>
              <div className="col-span-2 flex items-center border border-gray-300 rounded-xl px-4 h-14">
                <BedDouble className="mr-2 text-blue-700" size={18} />
                <select
                  value={kt}
                  onChange={(e) => setKt(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">KT</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div className="col-span-2 flex items-center border border-gray-300 rounded-xl px-4 h-14">
                <Bath className="mr-2 text-blue-700" size={18} />
                <select
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">KM</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div className="col-span-4 flex items-center border border-gray-300 rounded-xl px-4 h-14 gap-3">
                <Wallet className="text-blue-700" />
                <input
                  type="text"
                  placeholder="Min"
                  value={formatNumber(minPrice)}
                  onChange={(e) => handlePriceChange(e, setMinPrice)}
                  className="w-full outline-none"
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="Max"
                  value={formatNumber(maxPrice)}
                  onChange={(e) => handlePriceChange(e, setMaxPrice)}
                  className="w-full outline-none"
                />
              </div>
              <div className="col-span-2 flex items-center border border-gray-300 rounded-xl px-4 h-14">
                <Wallet className="mr-2 text-blue-700" />
                <select
                  value={sortPrice}
                  onChange={(e) => setSortPrice(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Urutkan</option>
                  <option value="asc">Termurah</option>
                  <option value="desc">Termahal</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className="lg:hidden px-4">
          <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center mt-1">
            <Search className="text-blue-700 mr-3" size={20} />
            <input
              type="text"
              placeholder="Cari rumah, ruko, tanah..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 w-full h-12 rounded-xl border font-semibold"
          >
            Reset Filter
          </button>
          <button
            onClick={() => setShowFilter(true)}
            className="mt-3 w-full h-12 rounded-xl bg-blue-700 text-white font-semibold"
          >
            Filter Properti
          </button>
        </div>
      </div>
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end lg:hidden">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Filter</h2>
              <button
                onClick={() => setShowFilter(false)}
                className="text-2xl text-blue-800 font-bold"
              >
                X
              </button>
            </div>
            <div className="mb-4">
              <label className="font-medium">Kecamatan</label>
              <select
                value={district}
                onChange={handleDistrictChange}
                className="w-full border border-gray-300 rounded-xl h-12 px-3 mt-2"
              >
                <option value="">Semua Kecamatan</option>

                {districts.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="font-medium">Kelurahan</label>

              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                disabled={!district}
                className="w-full border border-gray-300 rounded-xl h-12 px-3 mt-2"
              >
                <option value="">Semua Kelurahan</option>

                {villages.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="font-medium">Kelurahan</label>

              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                disabled={!district}
                className="w-full border border-gray-300 rounded-xl h-12 px-3 mt-2"
              >
                <option value="">Semua Kelurahan</option>

                {villages.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="font-medium">Jenis Properti</label>

              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full border border-gray-300 rounded-xl h-12 px-3 mt-2"
              >
                <option value="">Semua</option>
                <option value="Rumah">Rumah</option>
                <option value="Ruko">Ruko</option>
                <option value="Tanah">Tanah</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label>KT</label>

                <select
                  value={kt}
                  onChange={(e) => setKt(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl h-12 px-3 mt-2"
                >
                  <option value="">Semua</option>

                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label>KM</label>

                <select
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl h-12 px-3 mt-2"
                >
                  <option value="">Semua</option>

                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-medium">Harga</label>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Minimum"
                  value={formatNumber(minPrice)}
                  onChange={(e) => handlePriceChange(e, setMinPrice)}
                  className="border border-gray-300 rounded-xl h-12 px-3"
                />

                <input
                  type="text"
                  placeholder="Maximum"
                  value={formatNumber(maxPrice)}
                  onChange={(e) => handlePriceChange(e, setMaxPrice)}
                  className="border border-gray-300 rounded-xl h-12 px-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowFilter(false)}
                className="h-12 border border-gray-300 rounded-xl"
              >
                Batal
              </button>

              <button
                onClick={(e) => {
                  handleSearch(e);
                  setShowFilter(false);
                }}
                className="h-12 bg-blue-700 rounded-xl text-white font-semibold"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchNav;
