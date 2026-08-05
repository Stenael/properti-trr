import React from "react";
import { Search } from "lucide-react";

function Headline() {
  return (
    <section className="bg-[url('/bg.jpg')] bg-cover bg-center">
      <div className="max-w-7xl mx-auto px-10 py-46">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-blue-800 font-bold tracking-widest uppercase">
            Temukan Properti Anda
          </p>
          <h1 className="mt-4 text-5xl font-bold text-gray-800 leading-tight">
            Rumah dan Ruko
            <br />
            Sesuai Kebutuhan Anda
          </h1>
          <p className="mt-6 text-lg text-blue-800 leading-8">
            Cari properti dijual maupun disewakan di kota
            Surabaya dengan mudah dan cepat.
          </p>
        </div>
        
        {/* <div className="mt-14 bg-white rounded-2xl shadow-xl p-6">
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="flex items-center flex-1 px-6 gap-2">
              <Search className="text-blue-800" size={22} />
              <input
                type="text"
                placeholder="Cari rumah, apartemen, ruko..."
                className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full h-12 bg-blue-800 rounded-lg text-white font-semibold hover:bg-blue-500 transition flex items-center justify-center gap-2 cursor-pointer">
                <Search size={20} />
                Cari Properti
              </button>
            </div>
          </div>
        </div> */}

      </div>
    </section>
  );
}

export default Headline;