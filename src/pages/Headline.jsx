import React from "react";
import { Search } from "lucide-react";

function Headline() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-blue-800 font-bold tracking-widest uppercase">
            Temukan Properti Impian Anda
          </p>
          <h1 className="mt-4 text-5xl font-bold text-gray-800 leading-tight">
            Rumah, Apartemen, dan Ruko
            <br />
            Sesuai Kebutuhan Anda
          </h1>
          <p className="mt-6 text-lg text-gray-500 leading-8">
            Cari properti dijual maupun disewakan di kota
            Surabaya dengan mudah dan cepat.
          </p>
        </div>
        
        <div className="mt-14 bg-white rounded-2xl shadow-xl p-6">
          <div className="grid lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ">
                Status
              </label>
              <select className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-800 cursor-pointer">
                <option>Semua</option>
                <option>Dijual</option>
                <option>Disewa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Minimum
              </label>

              <input
                type="number"
                placeholder="Rp 0"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Maksimum
              </label>

              <input
                type="number"
                placeholder="Rp 5.000.000.000"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex items-end">

              <button className="w-full h-12 bg-blue-800 rounded-lg text-white font-semibold hover:bg-blue-500 transition flex items-center justify-center gap-2 cursor-pointer">

                <Search size={20} />

                Cari Properti

              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Headline;